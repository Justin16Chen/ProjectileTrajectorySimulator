import { useEffect } from 'react';
import { overlay } from '../styles/theme';

export interface ContextMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface Props {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: Props) {
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('[data-context-menu]')) return;
      onClose();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (items.length === 0) return null;

  return (
    <div
      data-context-menu
      className={overlay.menu}
      style={{ left: x, top: y }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.variant === 'danger' ? overlay.menuItemDanger : overlay.menuItem}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
