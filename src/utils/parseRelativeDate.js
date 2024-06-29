// utils/parseRelativeDate.js

import { addDays, startOfDay, nextDay, format } from 'date-fns';

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function parseRelativeDate(dateString) {
  const today = startOfDay(new Date());
  const lowerCaseDateString = dateString.toLowerCase();

  if (lowerCaseDateString === 'today') {
    return format(today, 'yyyy-MM-dd');
  }

  if (lowerCaseDateString === 'tomorrow') {
    return format(addDays(today, 1), 'yyyy-MM-dd');
  }

  const nextDayMatch = lowerCaseDateString.match(/next\s+(\w+)/);
  if (nextDayMatch) {
    const dayIndex = daysOfWeek.indexOf(nextDayMatch[1]);
    if (dayIndex !== -1) {
      const nextDate = nextDay(today, dayIndex);
      return format(nextDate, 'yyyy-MM-dd');
    }
  }

  const thisDayMatch = lowerCaseDateString.match(/this\s+(\w+)/);
  if (thisDayMatch) {
    const dayIndex = daysOfWeek.indexOf(thisDayMatch[1]);
    if (dayIndex !== -1) {
      let thisDate = nextDay(today, dayIndex);
      if (thisDate <= today) {
        thisDate = addDays(thisDate, 7);
      }
      return format(thisDate, 'yyyy-MM-dd');
    }
  }

  return null;
}