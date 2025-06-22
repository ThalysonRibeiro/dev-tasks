"use client"
import { useState } from 'react';

export function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Informações do mês atual
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = domingo

  // Gerar array de dias
  const days = [];

  // Espaços vazios no início
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  // Navegação
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="p-4">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth}>←</button>
        <h2>{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={goToNextMonth}>→</button>
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-0">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center font-semibold">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm border h-30">
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
}