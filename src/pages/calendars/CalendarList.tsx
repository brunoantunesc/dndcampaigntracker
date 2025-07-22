// src/pages/calendars/CalendarsList.tsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import {CommonButton} from '../../components/Buttons.tsx';
import { spacing } from '../../styles/designSystem.js';
import { Calendar } from '../../interfaces/Calendar.tsx';

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
      <div style={{paddingTop: spacing.xl}}>
      {calendars.length === 0 ? (
        <p className="text-gray-400">No calendar found.</p>
      ) : (
        <ul className="space-y-4">
          {calendars.map((calendar) => (
            <li key={calendar._id} className="p-4 border border-blue-500 rounded-lg">
              <h2 className="text-lg font-bold text-white">{calendar.name}</h2>
              <p className="text-xs text-gray-500 mt-1">
                Months: {calendar.months.length}
              </p>
            </li>
          ))}
        </ul>
      )}
      </div>

      <div style={{paddingTop: spacing.xl}} className="mt-6">
        <CommonButton variant="primary" onClick={() => window.location.href = '/calendars/create'}>
          Create new calendar
        </CommonButton>
      </div>
    </FormWrapper>
    </div>
    </>
  );
};

export default CalendarsList;
