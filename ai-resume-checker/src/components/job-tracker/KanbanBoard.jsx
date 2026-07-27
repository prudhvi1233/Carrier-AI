import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { KANBAN_COLUMNS, STATUS_MAP } from '../../mockJobTrackerData';
import { Calendar, MoreHorizontal } from 'lucide-react';

export default function KanbanBoard({ data, updateData, onStatusChange }) {
  
  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const draggedApp = data.find(app => app.id === draggableId);
      if (draggedApp && onStatusChange) {
        onStatusChange({ ...draggedApp, status: destination.droppableId });
      }
      
      // Optimistic UI update
      updateData(prev => prev.map(app => 
        app.id === draggableId ? { ...app, status: destination.droppableId } : app
      ));
    }
  };

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-x-auto overflow-y-hidden custom-scrollbar flex gap-4 pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {KANBAN_COLUMNS.map((column) => {
          const columnApps = data.filter(app => app.status === column.id);
          const config = STATUS_MAP[column.id];

          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
              <div className={`p-4 border-b border-white/5 bg-white/5 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.bg} border ${config.border}`}></div>
                  <h3 className="font-bold text-gray-200">{column.title}</h3>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {columnApps.length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''}`}
                  >
                    {columnApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`glass-card p-4 border border-white/10 hover:border-white/20 transition-colors ${snapshot.isDragging ? 'shadow-2xl shadow-accent-blue/20 rotate-2' : 'shadow-lg'}`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.company)}&background=random`} alt={app.company} className="w-8 h-8 rounded-lg bg-white" />
                                <div>
                                  <h4 className="font-bold text-white text-sm">{app.company}</h4>
                                  <p className="text-xs text-gray-400">{app.role}</p>
                                </div>
                              </div>
                              <button className="text-gray-500 hover:text-white transition-colors">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/5">
                              {app.interviewDate && (
                                <div className="flex items-center gap-1.5 text-xs text-accent-blue font-medium bg-accent-blue/10 px-2 py-1 rounded w-fit border border-accent-blue/20">
                                  <Calendar size={12} />
                                  {new Date(app.interviewDate).toLocaleDateString()}
                                </div>
                              )}
                              {!app.interviewDate && app.appliedDate && (
                                <div className="text-[11px] text-gray-500 font-medium">
                                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
