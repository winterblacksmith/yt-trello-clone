import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { VideoCard } from "./VideoCard";

interface VideoItem {
  id: string;
  title: string;
  status: string;
}

const COLUMNS = [
  { id: "scriptwriting", title: "Scriptwriting" },
  { id: "filming", title: "Filming" },
  { id: "editing", title: "Editing" },
  { id: "thumbnail", title: "Thumbnail Design" },
  { id: "published", title: "Published" },
];

const INITIAL_VIDEOS: VideoItem[] = [
  { id: "1", title: "React Best Practices 2024", status: "scriptwriting" },
  { id: "2", title: "Next.js 15 New Features", status: "filming" },
  { id: "3", title: "TypeScript Tips & Tricks", status: "editing" },
  { id: "4", title: "CSS Grid vs Flexbox", status: "thumbnail" },
  { id: "5", title: "JavaScript ES2024 Features", status: "published" },
];

export function KanbanBoard() {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    setVideos((videos) => {
      const activeItems = videos.filter((item) => item.status === activeContainer);
      const overItems = videos.filter((item) => item.status === overContainer);

      // Find the indexes
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      return videos.map((item) => {
        if (item.id === activeId) {
          return { ...item, status: overContainer };
        }
        return item;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const containerItems = videos.filter((item) => item.status === activeContainer);
      const activeIndex = containerItems.findIndex((item) => item.id === activeId);
      const overIndex = containerItems.findIndex((item) => item.id === overId);

      if (activeIndex !== overIndex) {
        setVideos((videos) => {
          const newVideos = [...videos];
          const containerVideos = newVideos.filter((item) => item.status === activeContainer);
          const otherVideos = newVideos.filter((item) => item.status !== activeContainer);
          
          const reorderedContainer = arrayMove(containerVideos, activeIndex, overIndex);
          
          return [...otherVideos, ...reorderedContainer];
        });
      }
    }

    setActiveId(null);
  };

  const findContainer = (id: string) => {
    const video = videos.find((item) => item.id === id);
    return video?.status;
  };

  const handleAddCard = (status: string) => {
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: "New Video Idea",
      status,
    };
    setVideos([...videos, newVideo]);
  };

  const handleUpdateCard = (id: string, title: string) => {
    setVideos(videos.map((video) => 
      video.id === id ? { ...video, title } : video
    ));
  };

  const handleDeleteCard = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  const getColumnItems = (status: string) => {
    return videos.filter((video) => video.status === status);
  };

  const activeVideo = activeId ? videos.find((video) => video.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 overflow-x-auto min-h-screen bg-gradient-to-br from-background to-muted/20">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            items={getColumnItems(column.id)}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </div>

      <DragOverlay>
        {activeVideo && (
          <VideoCard
            id={activeVideo.id}
            title={activeVideo.title}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}