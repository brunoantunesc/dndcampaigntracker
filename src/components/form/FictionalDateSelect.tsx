// src/components/form/FictionalDateSelect.tsx
import React, { useEffect, useState } from 'react';
import { getMonthsForCalendar, parseDate } from '../../utils/compareFictionalDates';
import { Month } from '../../interfaces/Month';

interface FictionalDateSelectProps {
  value: string;
  onChange: (val: string) => void;
  calendarId: string;
  label?: string;
  name?: string;
  disabled?: boolean;
}

const FictionalDateSelect: React.FC<FictionalDateSelectProps> = ({
  value,
  onChange,
  calendarId,
  label,
  name,
  disabled = false,
}) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (!disabled && calendarId) {
      getMonthsForCalendar(calendarId).then(setMonths);
    } else {
      setMonths([]);
      setSelectedMonth(null);
    }
  }, [calendarId, disabled]);

  useEffect(() => {
    if (!disabled && !!value) {
      const parsedDate = parseDate(value);
      setSelectedDay(parsedDate.day);
      setSelectedMonth(parsedDate.month);
      setSelectedYear(parsedDate.year);
    } else {
      setSelectedDay(null);
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  }, [value, disabled]);

  function getOrdinalSuffix(n: number) {
    if ([11, 12, 13].includes(n % 100)) return 'th';
    return ['th', 'st', 'nd', 'rd'][Math.min(n % 10, 4)] || 'th';
  }

  useEffect(() => {
    if (!disabled && selectedDay && selectedMonth && selectedYear !== null) {
      const formatted = `${selectedDay}${getOrdinalSuffix(selectedDay)} of ${selectedMonth} of the ${selectedYear}${getOrdinalSuffix(selectedYear)} year`;
      onChange(formatted);
    }
  }, [selectedDay, selectedMonth, selectedYear, disabled]);

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const monthObj = months.find((m) => m.name === selectedMonth);
  const daysInMonth = monthObj ? monthObj.days : 31;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium mb-1"
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <select
          value={selectedMonth ?? ''}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedDay(null);
          }}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-black border border-cyan-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            disabled ? disabledStyles : ''
          }`}
        >
          <option value="">Month</option>
          {months.map((month) => (
            <option key={month._id} value={month.name}>
              {month.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDay ?? ''}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          disabled={disabled || !selectedMonth}
          className={`w-full px-3 py-2 bg-black border border-cyan-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            disabled || !selectedMonth ? disabledStyles : ''
          }`}
        >
          <option value="">Day</option>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear ?? ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          placeholder="Year"
          disabled={disabled}
          className={`w-full px-3 py-2 bg-black border border-cyan-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            disabled || !selectedMonth ? disabledStyles : ''
          }`}
        />
      </div>
    </div>
  );
};

export default FictionalDateSelect;
