import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { VideoCard } from "./VideoCard";

interface VideoItem {
  id: string;
  title: string;
  status: string;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  items: VideoItem[];
  onAddCard: (status: string) => void;
  onUpdateCard: (id: string, title: string) => void;
  onDeleteCard: (id: string) => void;
}

export function KanbanColumn({
  id,
  title,
  items,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnStyle = () => {
    const colorMap: Record<string, { bg: string; border: string }> = {
      scriptwriting: { bg: "hsl(48 100% 95%)", border: "hsl(48 100% 85%)" },
      filming: { bg: "hsl(210 100% 95%)", border: "hsl(210 100% 85%)" },
      editing: { bg: "hsl(270 100% 95%)", border: "hsl(270 100% 85%)" },
      thumbnail: { bg: "hsl(30 100% 95%)", border: "hsl(30 100% 85%)" },
      published: { bg: "hsl(90 100% 95%)", border: "hsl(90 100% 85%)" },
    };

    const colors = colorMap[id] || { bg: "hsl(210 25% 97%)", border: "hsl(220 13% 91%)" };
    
    return {
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };
  };

  return (
    <div 
      className="border rounded-lg p-4 min-h-96 w-72 flex-shrink-0"
      style={getColumnStyle()}
    >
      <div className="column-header flex items-center justify-between">
        <h3>{title}</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-80 transition-colors ${
          isOver ? "bg-primary/5 rounded-lg" : ""
        }`}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <VideoCard
              key={item.id}
              id={item.id}
              title={item.title}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddCard(id)}
          className="add-card-btn"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Add a video</span>
        </button>
      </div>
    </div>
  );
}