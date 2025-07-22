// src/pages/calendars/CalendarsList
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import axios from 'axios';
import FormWrapper from '../../components/form/FormWrapper';
import {CommonButton} from '../../components/ui/Buttons';
import { spacing } from '../../styles/designSystem.js';
import { Calendar } from '../../interfaces/Calendar';
import { CardItem } from '../../components/ui/Cards';

const CalendarsList: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


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

    <div className="p-6 max-w-screen-lg mx-auto text-center">
    <FormWrapper title="My Calendars" onSubmit={(e) => e.preventDefault()}>
      <div style={{paddingTop: spacing.xl}}>
      {calendars.length === 0 ? (
        <p className="text-gray-400">No calendar found.</p>
      ) : (
        <ul className="space-y-4">
          {calendars.map((calendar) => (
            <CardItem 
              key={calendar._id}
              onEdit={() => navigate(`/calendars/edit/${calendar._id}`)}
              onDelete={() => console.log(`Delete arc ${calendar._id} (future implementation)`)}
            >
              <h2 className="text-lg font-bold text-white">{calendar.name}</h2>
              <p className="text-xs text-gray-500 mt-1">
                Months per year: {calendar.months.length}
                <br />
                Days per year: {calendar.months.reduce((total, month) => total + month.days, 0)}
              </p>
            </CardItem>
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
