// src/pages/calendars/CalendarsList.tsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import {CommonButton} from '../../components/Buttons.tsx';
import { spacing } from '../../styles/designSystem.js';

interface Calendar {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const CalendarsList: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get('/api/calendars', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCalendars(response.data);
      } catch (error) {
        console.error('Erro ao buscar calendários', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  if (loading) {
    return <p className="text-center">Carregando calendários...</p>;
  }

  return (
    <>

    <Header />

    <div style={{paddingLeft: spacing.lg, paddingTop: spacing.lg}} className="p-6 max-w-screen-lg mx-auto">
    <FormWrapper title="Meus Calendários" onSubmit={(e) => e.preventDefault()}>
      {calendars.length === 0 ? (
        <p className="text-gray-400">Nenhum calendário encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {calendars.map((calendar) => (
            <li key={calendar.id} className="p-4 border border-blue-500 rounded-lg">
              <h2 className="text-lg font-bold text-white">{calendar.name}</h2>
              {calendar.description && (
                <p className="text-sm text-gray-300">{calendar.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Criado em: {new Date(calendar.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <CommonButton variant="primary" onClick={() => window.location.href = '/calendars/create'}>
          Criar novo calendário
        </CommonButton>
      </div>
    </FormWrapper>
    </div>
    </>
  );
};

export default CalendarsList;
