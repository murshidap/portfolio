import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

interface SortableCollectionProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T, index: number, handle: ReactNode) => ReactNode;
  className?: string;
  rowClassName?: string;
  getItemLabel: (item: T) => string;
}

export function SortableCollection<T extends { id: string }>({
  items,
  onReorder,
  children,
  className,
  rowClassName,
  getItemLabel
}: SortableCollectionProps<T>) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={className ?? "contents"}>
          {items.map((item, index) => (
            <SortableCollectionRow
              key={item.id}
              id={item.id}
              label={getItemLabel(item)}
              className={rowClassName}
              render={(handle) => children(item, index, handle)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableCollectionRow({
  id,
  label,
  className,
  render
}: {
  id: string;
  label: string;
  className?: string;
  render: (handle: ReactNode) => ReactNode;
}) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({ id });

  const handle = (
    <button
      ref={setActivatorNodeRef}
      aria-label={`Reorder ${label}`}
      className="grid h-9 w-9 shrink-0 touch-none cursor-grab place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 active:cursor-grabbing"
      type="button"
      {...attributes}
      {...listeners}
    >
      <GripVertical aria-hidden="true" className="h-4 w-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : undefined,
        position: "relative",
        zIndex: isDragging ? 1 : undefined
      }}
    >
      {render(handle)}
    </div>
  );
}
