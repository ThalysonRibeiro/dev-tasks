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

  // Navegação por semana
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Gerar os dias da semana atual
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0 = domingo
    startOfWeek.setDate(date.getDate() - day);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const weekDays = getWeekDays(currentDate);
  const today = new Date();

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
    });
  };

  // Organizar itens por linha/posição para a semana atual
  const organizeItemsInRowsForWeek = useMemo(() => {
    const itemRows: { [key: string]: number } = {};
    let nextRowIndex = 0;

    // Filtrar itens que aparecem na semana atual
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];

    const itemsInWeek = items.filter(item => {
      const itemCreatedAt = new Date(item.createdAt);
      const itemTerm = new Date(item.term);

      // Normalizar datas
      const createdDate = new Date(itemCreatedAt.getFullYear(), itemCreatedAt.getMonth(), itemCreatedAt.getDate());
      const termDate = new Date(itemTerm.getFullYear(), itemTerm.getMonth(), itemTerm.getDate());
      const weekStartNorm = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
      const weekEndNorm = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());

      // Item aparece na semana se há sobreposição entre o período do item e a semana
      return !(termDate < weekStartNorm || createdDate > weekEndNorm);
    });

    // Identificar itens únicos e ordenar por data de criação
    const uniqueItems = Array.from(new Set(itemsInWeek.map(item => item.id)))
      .map(id => itemsInWeek.find(item => item.id === id)!)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Atribuir linhas sequenciais começando do 0 para cada semana
    uniqueItems.forEach(item => {
      if (!itemRows[item.id]) {
        itemRows[item.id] = nextRowIndex++;
      }
    });

    return { itemRows, maxRows: nextRowIndex };
  }, [items, weekDays]);

  const { itemRows, maxRows } = organizeItemsInRowsForWeek;

  return (
    <div className="p-4 text-zinc-100 min-h-screen">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-4">
        <Button variant={'outline'} size={'icon'} onClick={goToPreviousWeek}>
          <ChevronLeft />
        </Button>
        <h2 className="text-lg font-semibold">
          {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </h2>
        <Button variant={'outline'} size={'icon'} onClick={goToNextWeek}>
          <ChevronRight />
        </Button>
      </div>

      {/* Container com scroll horizontal */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header dos dias da semana */}
          <div className="grid grid-cols-7 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName, index) => {
              const day = weekDays[index];
              const isToday = day &&
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              return (
                <div
                  key={dayName}
                  className={cn(
                    "p-3 text-center font-semibold bg-zinc-800 border text-zinc-200",
                    isToday && "bg-violet-900/50 border-violet-500 ring-1 ring-violet-500"
                  )}
                >
                  <div className="text-sm font-medium">{dayName}</div>
                  <div className={cn(
                    "text-lg",
                    isToday && "text-violet-300 font-bold"
                  )}>
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {day.toLocaleDateString('pt-BR', { month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid dos itens - Gantt Style */}
          <div className="grid grid-cols-7 min-h-[calc(100vh-22rem)]">
            {weekDays.map((day, dayIndex) => {
              const dayItems = getItemsForDate(day).sort((a, b) => itemRows[a.id] - itemRows[b.id]);

              return (
                <div
                  key={dayIndex}
                  className={cn("bg-zinc-800 border-r relative py-0.5 min-h-[calc(100vh-22rem)]",
                    dayIndex === 0 && "border-l"
                  )}
                >
                  {/* Renderizar linhas para cada item */}
                  {Array.from({ length: Math.max(1, maxRows) }).map((_, rowIndex) => {
                    const itemInThisRow = dayItems.find(item => itemRows[item.id] === rowIndex);

                    if (!itemInThisRow) {
                      return (
                        <div
                          key={rowIndex}
                          className="h-8 mb-1 flex items-center"
                        // style={{ marginTop: `${rowIndex * 36}px` }}
                        />
                      );
                    }

                    const isCreated = new Date(itemInThisRow.createdAt).toDateString() === day.toDateString();
                    const isDeadline = new Date(itemInThisRow.term).toDateString() === day.toDateString();
                    const isFirstDay = isCreated;
                    const isLastDay = isDeadline;

                    return (
                      <div
                        key={`${itemInThisRow.id}-${rowIndex}`}
                        className={cn(
                          "absolute left-1 right-1 h-7 mb-1 flex items-center px-2 text-xs truncate",
                          colorStatus(itemInThisRow.status),
                          // Bordas arredondadas apenas no início e fim
                          isFirstDay && "rounded-l-md",
                          isLastDay && "rounded-r-md",
                          !isFirstDay && !isLastDay && "rounded-none",
                          isFirstDay && isLastDay && "rounded-md", // Item de um dia só
                          // Destaque para prazos
                          isDeadline && "ring-1 ring-white",
                          isCreated && "font-semibold"
                        )}
                        style={{
                          top: `${rowIndex * 36 + 4}px`,
                          zIndex: isDeadline ? 10 : 1
                        }}
                        title={`${itemInThisRow.title} (${new Date(itemInThisRow.createdAt).toLocaleDateString('pt-BR')} - ${new Date(itemInThisRow.term).toLocaleDateString('pt-BR')})`}
                      >
                        <span className="truncate">
                          {isFirstDay && itemInThisRow.title}
                          {!isFirstDay && !isLastDay && ""}
                          {isLastDay && !isFirstDay && ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-4 text-xs text-zinc-400">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/50 border-2 border-white rounded"></div>
                <span>Com prazo hoje</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-900/50 rounded-l border border-blue-400"></div>
                <span>Início do item</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-900/50 rounded-r border border-blue-400"></div>
                <span>Fim do item</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}