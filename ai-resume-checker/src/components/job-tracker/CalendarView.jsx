import React from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, parseISO } from 'date-fns';

export default function CalendarView({ data }) {
  const currentDate = new Date('2023-10-15'); // Fixed to match mock data dates, ideally use new Date()
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Find events for this day
      const dayEvents = data.filter(app => {
        if (app.interviewDate) return isSameDay(parseISO(app.interviewDate), cloneDay);
        if (app.appliedDate) return isSameDay(parseISO(app.appliedDate), cloneDay);
        return false;
      });

      days.push(
        <div 
          key={day.toString()} 
          className={`min-h-[120px] p-2 border-r border-b border-white/5 ${!isSameMonth(day, monthStart) ? 'bg-white/[0.01] text-gray-600' : 'bg-transparent text-gray-300'}`}
        >
          <span className={`text-sm font-medium ${isSameDay(day, currentDate) ? 'bg-accent-blue text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
            {formattedDate}
          </span>
          <div className="mt-2 flex flex-col gap-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className={`text-[10px] p-1.5 rounded border truncate ${
                  event.interviewDate && isSameDay(parseISO(event.interviewDate), cloneDay)
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                }`}
              >
                <span className="font-bold">{event.company}</span>
                <br />
                {event.interviewDate && isSameDay(parseISO(event.interviewDate), cloneDay) ? 'Interview' : 'Applied'}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{format(currentDate, "MMMM yyyy")}</h2>
      </div>
      <div className="grid grid-cols-7 border-b border-white/5 bg-white/5">
        {weekDays.map(dayName => (
          <div key={dayName} className="py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-white/5 last:border-r-0">
            {dayName}
          </div>
        ))}
      </div>
      <div className="border-l border-white/5">
        {rows}
      </div>
    </div>
  );
}
