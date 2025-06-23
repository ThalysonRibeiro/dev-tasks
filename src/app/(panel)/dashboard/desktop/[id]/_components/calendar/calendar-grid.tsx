"use client"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { GroupWithItems } from '../main-board/group-content';
import { Item } from '@/generated/prisma';
import { colorStatus } from '@/utils/colorStatus-priority';

export function CalendarGrid({ groupsData }: { groupsData: GroupWithItems[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

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

  // Memoizar os itens para performance
  const items: Item[] = useMemo(() => {
    const allItems: Item[] = [];
    groupsData.forEach((groupStatus) => {
      if (Array.isArray(groupStatus.item)) {
        allItems.push(...groupStatus.item);
      } else {
        allItems.push(groupStatus.item);
      }
    });
    return allItems;
  }, [groupsData]);

  // Organizar itens por linha/posição para alinhamento visual
  const organizeItemsInRows = () => {
    const itemRows: { [key: string]: number } = {};
    let nextRowIndex = 0;

    // Primeiro, identificar todos os itens únicos e suas posições
    const uniqueItems = Array.from(new Set(items.map(item => item.id)))
      .map(id => items.find(item => item.id === id)!)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    uniqueItems.forEach(item => {
      if (!itemRows[item.id]) {
        itemRows[item.id] = nextRowIndex++;
      }
    });

    return itemRows;
  };

  const itemRows = useMemo(organizeItemsInRows, [items]);

  // Função para verificar se um item deve ser exibido em uma data específica
  const getItemsForDate = (date: Date) => {
    return items.filter(item => {
      const itemCreatedAt = new Date(item.createdAt);
      const itemTerm = new Date(item.term);

      // Normalizar as datas para comparação (apenas ano, mês, dia)
      const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const createdDate = new Date(itemCreatedAt.getFullYear(), itemCreatedAt.getMonth(), itemCreatedAt.getDate());
      const termDate = new Date(itemTerm.getFullYear(), itemTerm.getMonth(), itemTerm.getDate());

      // Item é exibido se está entre a data de criação e o prazo (inclusive)
      return dateToCheck >= createdDate && dateToCheck <= termDate;
    }).sort((a, b) => itemRows[a.id] - itemRows[b.id]); // Ordenar por linha
  };

  return (
    <div className="p-4">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-4">
        <Button variant={'outline'} size={'icon'} onClick={goToPreviousMonth}>
          <ChevronLeft />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <Button variant={'outline'} size={'icon'} onClick={goToNextMonth}>
          <ChevronRight />
        </Button>
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-500 border">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isToday = day &&
            day.getDate() === currentDay &&
            day.getMonth() === currentMonth &&
            day.getFullYear() === currentYear;

          const dayItems = day ? getItemsForDate(day) : [];

          return (
            <div
              key={index}
              className={cn(
                "text-center text-sm min-h-24 flex flex-col border-b border-l",
                isToday && "border border-violet-500",
                !day && "bg-gray-500",
                index === 0 && "border-r-0",
                index === 6 && "border-r",
                index === 13 && "border-r",
                index === 20 && "border-r",
                index === 27 && "border-r",
                index === 29 && "border-r",
                index === 30 && "border-r",
              )}
            >
              <div className="font-medium mb-0.5 text-center flex-shrink-0">
                {day ? day.getDate() : ''}
              </div>

              <div className="flex flex-col gap-0.5 h-full">
                {Array.from({ length: Math.max(3, Object.keys(itemRows).length) }).map((_, rowIndex) => {
                  const itemInThisRow = dayItems.find(item => itemRows[item.id] === rowIndex);

                  if (!itemInThisRow) {
                    return <div key={rowIndex} className="h-5 flex-shrink-0" />; // Espaço vazio para manter alinhamento
                  }

                  const isCreated = day && new Date(itemInThisRow.createdAt).toDateString() === day.toDateString();
                  const isDeadline = day && new Date(itemInThisRow.term).toDateString() === day.toDateString();
                  const isFirstDay = isCreated;
                  const isLastDay = isDeadline;

                  return (
                    <div
                      key={`${itemInThisRow.id}-${rowIndex}`}
                      className={cn(
                        "text-xs px-2 py-0.5 truncate h-5 flex items-center flex-shrink-0 line-clamp-1",
                        colorStatus(itemInThisRow.status),
                        // Bordas arredondadas apenas no início e fim
                        isFirstDay && "rounded-l-md",
                        isLastDay && "rounded-r-md",
                        !isFirstDay && !isLastDay && "rounded-none",
                        isFirstDay && isLastDay && "rounded-md", // Item de um dia só
                        // Destaque para prazos
                        isDeadline && "ring-1 ring-red-400",
                        isCreated && "font-semibold"
                      )}
                      title={`${itemInThisRow.title}`}
                    >
                      {itemInThisRow.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}