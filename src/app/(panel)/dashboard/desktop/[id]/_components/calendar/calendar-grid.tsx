"use client"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useState, useMemo } from 'react';
import { GroupWithItems } from '../main-board/group-content';
import { Item } from '@/generated/prisma';
import { colorStatus, statusMap } from '@/utils/colorStatus-priority';

export function GanttCalendar({ groupsData }: { groupsData?: GroupWithItems[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [showTaskList, setShowTaskList] = useState(true);

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Generate days for current view
  const getDaysInView = (date: Date) => {
    if (viewMode === 'week') {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(date.getDate() - day);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        days.push(currentDay);
      }
      return days;
    } else {
      // Month view
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const startDate = new Date(startOfMonth);
      startDate.setDate(startDate.getDate() - startOfMonth.getDay());
      const endDate = new Date(endOfMonth);
      if (endOfMonth.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));
      }

      const days = [];
      const currentDay = new Date(startDate);

      while (currentDay <= endDate) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return days;
    }
  };

  const viewDays = getDaysInView(currentDate);
  const today = new Date();

  // Flatten items
  const items: Item[] = useMemo(() => {
    const allItems: Item[] = [];
    if (!groupsData) {
      return allItems;
    }
    groupsData.forEach((groupStatus) => {
      if (Array.isArray(groupStatus.item)) {
        allItems.push(...groupStatus.item);
      } else if (groupStatus.item) {
        allItems.push(groupStatus.item);
      }
    });
    return allItems;
  }, [groupsData]);

  // Organize items in rows and calculate their spans
  const organizeItemsInRows = useMemo(() => {
    const itemRows: { [key: string]: number } = {};
    let nextRowIndex = 0;

    const viewStart = viewDays[0];
    const viewEnd = viewDays[viewDays.length - 1];

    const itemsInView = items.filter(item => {
      const itemCreatedAt = new Date(item.createdAt);
      const itemTerm = new Date(item.term);

      const createdDate = new Date(itemCreatedAt.getFullYear(), itemCreatedAt.getMonth(), itemCreatedAt.getDate());
      const termDate = new Date(itemTerm.getFullYear(), itemTerm.getMonth(), itemTerm.getDate());
      const viewStartNorm = new Date(viewStart.getFullYear(), viewStart.getMonth(), viewStart.getDate());
      const viewEndNorm = new Date(viewEnd.getFullYear(), viewEnd.getMonth(), viewEnd.getDate());

      return !(termDate < viewStartNorm || createdDate > viewEndNorm);
    });

    const uniqueItems = Array.from(new Set(itemsInView.map(item => item.id)))
      .map(id => itemsInView.find(item => item.id === id)!)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    uniqueItems.forEach(item => {
      if (!itemRows[item.id]) {
        itemRows[item.id] = nextRowIndex++;
      }
    });

    return { itemRows, maxRows: nextRowIndex, itemsInView: uniqueItems };
  }, [items, viewDays]);

  const { itemRows, maxRows, itemsInView } = organizeItemsInRows;

  // Calculate item spans across days
  const getItemSpans = useMemo(() => {
    const spans: { [key: string]: { startIndex: number; endIndex: number; width: number } } = {};

    itemsInView.forEach(item => {
      const itemCreatedAt = new Date(item.createdAt);
      const itemTerm = new Date(item.term);

      // Normalize dates to ignore time
      const createdDate = new Date(itemCreatedAt.getFullYear(), itemCreatedAt.getMonth(), itemCreatedAt.getDate());
      const termDate = new Date(itemTerm.getFullYear(), itemTerm.getMonth(), itemTerm.getDate());

      let startIndex = -1;
      let endIndex = -1;

      // Find start and end indices within the view
      viewDays.forEach((day, index) => {
        const dayNorm = new Date(day.getFullYear(), day.getMonth(), day.getDate());

        if (dayNorm >= createdDate && startIndex === -1) {
          startIndex = index;
        }
        if (dayNorm <= termDate) {
          endIndex = index;
        }
      });

      // Ensure we have valid indices
      if (startIndex === -1) startIndex = 0;
      if (endIndex === -1) endIndex = viewDays.length - 1;

      const width = endIndex - startIndex + 1;

      spans[item.id] = { startIndex, endIndex, width };
    });

    return spans;
  }, [itemsInView, viewDays]);

  // Fixed function signature to accept Date objects or strings
  const getDurationInDays = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getProgress = (item: Item) => {
    if (item.status === 'DONE') return 100;
    if (item.status === 'IN_PROGRESS') return 60;
    if (item.status === 'STOPPED') return 10;
    if (item.status === 'NOT_STARTED') return 0;
    return 0;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL': return 'border-l-red-500';
      case 'HIGH': return 'border-l-orange-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      case 'LOW': return 'border-l-green-500';
      case 'STANDARD': return 'border-l-blue-500';
      default: return 'border-l-zinc-500';
    }
  };

  // Get items that should be rendered (only those that start in the current day)
  const getItemsStartingOnDate = (dayIndex: number) => {
    return itemsInView.filter(item => {
      const span = getItemSpans[item.id];
      return span && span.startIndex === dayIndex;
    });
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Task List Sidebar */}
      {showTaskList && (
        <div className="w-80 bg-zinc-800 border-r border-zinc-700 flex flex-col">
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-lg font-semibold mb-2">Tarefas</h3>
            <div className="text-sm text-zinc-400">
              {itemsInView.length} tarefas em vista
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {itemsInView.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "p-3 border-l-4 border-b border-zinc-700 hover:bg-zinc-700/50 cursor-pointer",
                  getPriorityColor(item.priority)
                )}
                style={{ backgroundColor: `rgba(59, 130, 246, ${0.1 + (index % 2) * 0.05})` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.status === 'DONE' && "bg-green-500/20 text-green-400",
                    item.status === 'IN_PROGRESS' && "bg-blue-500/20 text-blue-400",
                    item.status === 'STOPPED' && "bg-red-500/20 text-red-400",
                    item.status === 'NOT_STARTED' && "bg-gray-500/20 text-gray-400"
                  )}>
                    {statusMap[item.status as keyof typeof statusMap] || item.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mb-2">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')} - {new Date(item.term).toLocaleDateString('pt-BR')}
                  <span className="ml-2">({getDurationInDays(item.createdAt, item.term)} dias)</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      item.status === 'DONE' && "bg-green-500",
                      item.status === 'IN_PROGRESS' && "bg-blue-500",
                      item.status === 'STOPPED' && "bg-red-500",
                      item.status === 'NOT_STARTED' && "bg-gray-500"
                    )}
                    style={{ width: `${getProgress(item)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Gantt Chart */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="shrink-0 p-4 bg-zinc-800 border-b border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTaskList(!showTaskList)}
              >
                <List className="w-4 h-4 mr-2" />
                {showTaskList ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Mês
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-sm font-semibold min-w-[200px] text-center">
                {viewMode === 'week'
                  ? `${viewDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${viewDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                }
              </h2>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              <Calendar className="w-4 h-4 mr-2" />
              Today
            </Button>
          </div>

          {/* Timeline Header */}
          <div className="grid grid-cols-7 gap-px">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName, index) => (
              <div key={dayName} className="p-3 text-center bg-zinc-700 border border-zinc-600">
                <div className="text-xs font-medium text-zinc-300 mb-1">{dayName}</div>
                <div className="text-sm font-semibold text-zinc-100">
                  {viewDays[index]?.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Chart Body - Com overflow */}
        <div className="flex-1 overflow-auto bg-zinc-800">
          <div className="relative min-h-full">
            {/* Background grid */}
            <div className="absolute inset-0">
              <div className="grid grid-cols-7 gap-px h-full min-h-[400px]">
                {viewDays.map((day, dayIndex) => {
                  const isToday = day.toDateString() === today.toDateString();
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "bg-zinc-900 relative",
                        !isCurrentMonth && "bg-zinc-900/50",
                        isToday && "bg-violet-900/20"
                      )}
                    >
                      {/* Grid lines horizontais para cada linha de tarefa */}
                      {Array.from({ length: Math.max(10, maxRows + 2) }).map((_, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="absolute left-0 right-0 border-b border-zinc-700/20"
                          style={{ top: `${rowIndex * 48}px` }}
                        />
                      ))}
                      {/* Linha vertical no meio para indicar hoje */}
                      {isToday && (
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-violet-400 z-30 opacity-60" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task bars */}
            <div className="relative z-10" style={{ minHeight: `${Math.max(400, maxRows * 48 + 100)}px` }}>
              {itemsInView.map((item) => {
                const span = getItemSpans[item.id];
                const rowIndex = itemRows[item.id];

                if (!span) return null;

                const itemTerm = new Date(item.term);
                const isDeadline = new Date(itemTerm.toDateString()) <= new Date(viewDays[span.endIndex]?.toDateString() || '');

                // Calcula posição baseada no grid de 7 colunas
                const gridColumnStart = span.startIndex + 1;
                const gridColumnEnd = span.endIndex + 2;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "absolute flex items-center px-3 py-1 text-xs font-medium border-l-4 rounded-lg mx-1",
                      colorStatus(item.status),
                      getPriorityColor(item.priority),
                      isDeadline && "ring-1 ring-white/30",
                      "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                    )}
                    style={{
                      gridColumn: `${gridColumnStart} / ${gridColumnEnd}`,
                      top: `${rowIndex * 48 + 8}px`,
                      left: `${(span.startIndex / 7) * 100}%`,
                      width: `${(span.width / 7) * 100}%`,
                      height: '32px',
                      zIndex: isDeadline ? 20 : 10
                    }}
                    title={`${item.title}\nStatus: ${statusMap[item.status as keyof typeof statusMap] || item.status}\nPriority: ${item.priority || 'normal'}\nDuration: ${getDurationInDays(item.createdAt, item.term)} days\nStart: ${new Date(item.createdAt).toLocaleDateString('pt-BR')}\nEnd: ${new Date(item.term).toLocaleDateString('pt-BR')}`}
                  >
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="font-semibold truncate flex-1 mr-2">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Progress indicator */}
                        <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/60 transition-all duration-300"
                            style={{ width: `${getProgress(item)}%` }}
                          />
                        </div>
                        {/* Duration indicator */}
                        <span className="text-xs opacity-75 whitespace-nowrap">
                          {getDurationInDays(item.createdAt, item.term)}d
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Legend - Fixo */}
        <div className="shrink-0 p-4 bg-zinc-800 border-t border-zinc-700">
          <div className="flex flex-wrap gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/80 rounded border-l-4 border-l-green-500"></div>
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/80 rounded border-l-4 border-l-blue-500"></div>
              <span>Em andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/80 rounded border-l-4 border-l-red-500"></div>
              <span>Interrompido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500/80 rounded border-l-4 border-l-gray-500"></div>
              <span>Não iniciado</span>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <div className="w-4 h-2 bg-red-500 rounded"></div>
              <span>Alta prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-yellow-500 rounded"></div>
              <span>Média prioridade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 rounded"></div>
              <span>Baixa prioridade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}