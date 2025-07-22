import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import InputField from "../../components/form/InputField"
import { CommonButton } from '../../components/Buttons';
import SelectField from '../../components/form/SelectField';
import { authFetch } from '../../utils/authFetch';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { Calendar } from '../../interfaces/Calendar';

interface WorldFormData {
  name: string;
  description: string;
  calendar: string,
}

const CreateWorld: React.FC = () => {
  const [form, setForm] = useState<WorldFormData>({
    name: '',
    description: '',
    calendar: '',
  });

  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await authFetch('/api/calendars', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCalendars(data);
        } else {
          console.error('Erro ao buscar calendários');
        }
      } catch (err) {
        console.error('Erro ao buscar calendários', err);
      }
    };

    fetchCalendars();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch('/api/worlds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate(`/worlds`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create world');
      }
    } catch (err) {
      console.error('Error creating world', err);
    }
  };

  return (
    <>
      <Header />
      <div style={{ paddingTop: spacing.lg, paddingLeft: spacing.lg }}>
        <FormWrapper title="Create New World" onSubmit={handleSubmit}>
          <InputField
            label="World Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter a name for your world"
          />

          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Optional description"
          />

          <SelectField
            label="Calendário"
            name="calendar"
            value={form.calendar}
            onChange={handleSelectChange}
            options={calendars.map((c) => ({
              value: c._id,
              label: c.name,
            }))}
            placeholder="Selecione um calendário"
          />

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <div>
            <CommonButton variant="secondary" onClick={() => navigate('/worlds/')}>Cancel</CommonButton>
            </div>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CreateWorld;
