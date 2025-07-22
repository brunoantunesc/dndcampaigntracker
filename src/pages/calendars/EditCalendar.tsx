import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import InputField from '../../components/form/InputField';
import { authFetch } from '../../utils/authFetch';
import { spacing } from '../../styles/designSystem';
import AddMonthDialog from '../../components/ui/AddMonthDialog';

interface Month {
  _id: string;
  name: string;
  days: number;
  order: number;
}

interface CalendarData {
  _id: string;
  name: string;
  months: Month[];
}

const EditCalendar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [originalCalendar, setOriginalCalendar] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMonthDialog, setShowAddMonthDialog] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await authFetch(`/api/calendars/${id}`);
        const data = await res.json();
        // Ordena meses por ordem (order)
        const sortedMonths = data.months.sort((a: Month, b: Month) => a.order - b.order);
        setCalendar({ ...data, months: sortedMonths });
        setOriginalCalendar({ ...data, months: sortedMonths });
      } catch (error) {
        console.error('Error fetching calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!calendar) return;
    const { name, value } = e.target;
    setCalendar({ ...calendar, [name]: value });
  };

  // Função para mover o mês pra cima ou pra baixo
  const moveMonth = (index: number, direction: 'up' | 'down') => {
    if (!calendar) return;
    const months = [...calendar.months];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= months.length) return;
    [months[index], months[newIndex]] = [months[newIndex], months[index]];
    setCalendar({ ...calendar, months });
  };

  // Quando adicionar mês via diálogo, backend retorna Month completo (_id, name, days, order)
  const handleMonthAdded = (monthData: { name: string; days: number }) => {
    if (!calendar) return;

    // Aqui faz POST para backend para salvar o mês e obter _id + order
    (async () => {
      try {
        const res = await authFetch('/api/months', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(monthData),
        });
        if (!res.ok) throw new Error('Failed to create month');
        const newMonth: Month = await res.json();

        // Adiciona o mês novo e ordena pela ordem
        const updatedMonths = [...calendar.months, newMonth].sort((a, b) => a.order - b.order);
        setCalendar({ ...calendar, months: updatedMonths });
        setShowAddMonthDialog(false);
      } catch (error) {
        console.error('Error adding new month:', error);
        alert('Failed to add new month');
      }
    })();
  };

  // Verifica se houve mudanças no nome ou na ordem dos meses
  const hasChanges = () => {
    if (!calendar || !originalCalendar) return false;
    if (calendar.name !== originalCalendar.name) return true;

    const originalIds = originalCalendar.months.map((m) => m._id);
    const currentIds = calendar.months.map((m) => m._id);
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendar) return;

    try {
      // Atualiza o nome do calendário
      await authFetch(`/api/calendars/${calendar._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: calendar.name }),
      });

      // Atualiza a ordem dos meses
      await Promise.all(
        calendar.months.map((month, index) =>
          authFetch(`/api/months/${month._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: index }),
          })
        )
      );

      navigate('/calendars');
    } catch (error) {
      console.error('Error updating calendar:', error);
      alert('Failed to update calendar');
    }
  };

  if (loading || !calendar) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="text-center" style={{ maxWidth: 800, margin: '0 auto', padding: spacing.lg }}>
        <FormWrapper title="Edit Calendar" onSubmit={handleSubmit}>
          <InputField
            label="Name"
            name="name"
            value={calendar.name}
            onChange={handleInputChange}
            placeholder="Enter calendar name"
          />

          <div className="text-left pt-6">
            <p className="text-white font-bold text-sm">Months</p>
            <ul className="pt-2">
              {calendar.months.map((month, index) => (
                <li key={month._id} className="flex items-center gap-4 py-1">
                  <span className="text-white text-sm w-50">
                    {month.name} ({month.days} days)
                  </span>
                  <CommonButton
                    type="button"
                    variant="mini"
                    onClick={() => moveMonth(index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </CommonButton>
                  <CommonButton
                    type="button"
                    variant="mini"
                    onClick={() => moveMonth(index, 'down')}
                    disabled={index === calendar.months.length - 1}
                  >
                    ↓
                  </CommonButton>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <CommonButton
              type="button"
              onClick={() => setShowAddMonthDialog(true)}
              variant="secondary"
            >
              + New Month
            </CommonButton>
          </div>

          <AddMonthDialog
            open={showAddMonthDialog}
            onClose={() => setShowAddMonthDialog(false)}
            onSave={handleMonthAdded}
          />

          <div className="flex flex-row gap-8 pt-10">
            <CommonButton type="submit" disabled={!hasChanges()}>
              Save
            </CommonButton>
            <CommonButton type="button" variant="secondary" onClick={() => navigate('/calendars')}>
              Cancel
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default EditCalendar;
