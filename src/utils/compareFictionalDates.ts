// src/utils/compareFictionalDates.ts
import axios from 'axios';
import { Month } from '../interfaces/Month';
import { Calendar } from '../interfaces/Calendar';
import { authFetch } from './authFetch';

interface ParsedDate {
  day: number;
  month: string;
  year: number;
}

function parseDay(dayStr: string): number {
  return parseInt(dayStr.replace(/(st|nd|rd|th)/, ''), 10);
}

function parseYear(yearStr: string): number {
  const match = yearStr.match(/(\d+)/);
  if (!match) throw new Error('Invalid year format');
  return parseInt(match[1], 10);
}

export function parseDate(dateStr: string): ParsedDate {
  const parts = dateStr.split(' of ').map(p => p.trim());
  if (parts.length < 3) throw new Error('Invalid date format');
  const day = parseDay(parts[0]);
  const month = parts[1];
  const year = parseYear(parts[2]);
  return { day, month, year };
}

const calendarCache: Record<string, Month[]> = {};

export async function getMonthsForCalendar(calendarId: string): Promise<Month[]> {
  if (calendarCache[calendarId]) {
    return calendarCache[calendarId];
  }
  
  const res = await authFetch(`/api/calendars/${calendarId}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch calendar');
  }
  
  const calendar: Calendar = await res.json();
  
  const monthsSorted = calendar.months.sort((a, b) => a.order - b.order);
  
  calendarCache[calendarId] = monthsSorted;
  
  return monthsSorted;
}

export async function compareFictionalDates(
  dateA: string,
  dateB: string,
  calendarId: string
): Promise<number> {
  const parsedA = parseDate(dateA);
  const parsedB = parseDate(dateB);

  if (parsedA.year !== parsedB.year) {
    return parsedA.year - parsedB.year;
  }

  const months = await getMonthsForCalendar(calendarId);
  const monthOrderMap: Record<string, number> = {};
  months.forEach((m) => {
    monthOrderMap[m.name.toLowerCase()] = m.order;
  });

  const orderA = monthOrderMap[parsedA.month.toLowerCase()];
  const orderB = monthOrderMap[parsedB.month.toLowerCase()];

  if (orderA === undefined || orderB === undefined) {
    throw new Error(
      'Month not found in calendar: ' +
        (orderA === undefined ? parsedA.month : parsedB.month)
    );
  }

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return parsedA.day - parsedB.day;
}
