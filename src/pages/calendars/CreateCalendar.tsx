// src/pages/calendars/CreateCalendar.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import { CommonButton, ToggleButton } from '../../components/Buttons.tsx';
import InputField from '../../components/form/InputField.tsx';
import { spacing } from '../../styles/designSystem';
import AddMonthDialog from '../../components/AddMonthDialog.tsx';

interface Month {
  _id: string;
  name: string;
  days: number;
}

const CreateCalendar: React.FC = () => {
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [months, setMonths] = useState<Month[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showAddMonthDialog, setShowAddMonthDialog] = useState(false);
  const [selectedMonthIds, setSelectedMonthIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    axios.get(`api/months`)
      .then((response) => setMonths(response.data))
      .catch((error) => console.error('Erro ao buscar meses:', error));
  }, []);

  const handleAddMonth = async (newMonth: { name: string; days: number }) => {
    try {
      const response = await axios.post(`/api/months`, newMonth, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const savedMonth = response.data;
      setMonths((prev) => [...prev, savedMonth]);
      setSelectedMonths((prev) => [...prev, savedMonth._id]);
      setShowAddMonthDialog(false);
    } catch (err) {
      console.error('Erro ao criar novo mês:', err);
    }
  };

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await axios.get('/api/months', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMonths(response.data);
      } catch (error) {
        console.error('Erro ao buscar meses:', error);
      }
    };

    fetchMonths();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/calendars',
        { name, months: selectedMonthIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/calendars');
    } catch (error) {
      console.error('Erro ao criar calendário:', error);
    }
  };

  const toggleMonthSelection = (monthId: string) => {
    setSelectedMonthIds((prev) =>
      prev.includes(monthId)
        ? prev.filter((id) => id !== monthId)
        : [...prev, monthId]
    );
  };

  return (
      <>
      <Header />
    <div style={{ padding: spacing.lg }} className="max-w-screen-lg mx-auto">
      <FormWrapper title="Criar Calendário" onSubmit={handleSubmit}>
        <InputField
          label="Nome do calendário"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Insira o nome do calendário"
        />

        <div style={{paddingTop: spacing.md}} className="mt-6">
          <label className="text-white block mb-2 font-medium">Meses</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {months.map((month) => {
              return (
              <div>
                <ToggleButton
                  key={month._id}
                  selected={selectedMonthIds.includes(month._id)}
                  onClick={() => toggleMonthSelection(month._id)}
                >
                  {month.name} ({month.days}d)
                </ToggleButton>
              </div>
            )})}
            <div style={{paddingTop: spacing.xs}}>
              <CommonButton
                type="button"
                className="px-3 py-1 rounded-full bg-gray-700 text-gray-400 border border-gray-600"
                onClick={() => setShowAddMonthDialog(true)}
              >
                + New month
              </CommonButton>
            </div>
          </div>
        </div>

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <div>
            <CommonButton variant="secondary" onClick={() => navigate('/calendars/')}>Cancel</CommonButton>
            </div>
          </div>

        <AddMonthDialog
          open={showAddMonthDialog}
          onClose={() => setShowAddMonthDialog(false)}
          onSave={handleAddMonth}
        />
      </FormWrapper>
    </div>
      </>
  );
};

export default CreateCalendar;
