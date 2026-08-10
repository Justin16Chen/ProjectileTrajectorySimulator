import { useRef } from 'react';
import { Upload, Film, Trash2 } from 'lucide-react';
import { VideoData } from '../types';
import { button, layout, list, text } from '../styles/theme';

interface Props {
  videos: VideoData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpload: (files: FileList) => void;
  onDelete: (id: string) => void;
  width: number;
}

export default function VideoSidebar({ videos, selectedId, onSelect, onUpload, onDelete, width }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  }

  return (
    <aside className={`${layout.panel} ${layout.panelBorderRight}`} style={{ width }}>
      <div className={layout.panelBlock}>
        <h2 className={text.sectionTitle}>Videos</h2>
        <button
          onClick={() => inputRef.current?.click()}
          className={`${button.primary} ${button.block}`}
        >
          <Upload size={16} />
          Upload Video
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*,.mov,.mp4,.m4v,.avi,.3gp"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {videos.length === 0 && (
          <p className={`${text.empty} mt-8 px-2`}>
            No videos yet. Upload an iPhone video to get started.
          </p>
        )}
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`${list.item(v.id === selectedId)} group flex items-center gap-2.5`}
          >
            <Film size={15} className="flex-shrink-0" />
            <span className="text-xs font-medium truncate flex-1">{v.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(v.id); }}
              className={`${
                v.id === selectedId ? button.iconGhostInverse : button.iconGhostDanger
              } flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
