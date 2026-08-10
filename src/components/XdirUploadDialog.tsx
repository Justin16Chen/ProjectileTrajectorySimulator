import { useState } from 'react';
import type { XDir } from '../types';
import { button, overlay, text } from '../styles/theme';

type Props = {
  onSubmit: (xdir: XDir) => void;
  onCancel: () => void;
} & (
  | { mode?: 'upload'; fileCount: number }
  | { mode: 'edit'; videoName: string; initialXdir: XDir }
);

export default function XdirUploadDialog(props: Props) {
  const { onSubmit, onCancel } = props;
  const isEdit = props.mode === 'edit';
  const initialXdir = isEdit ? props.initialXdir : 1;
  const [xdir, setXdir] = useState<XDir>(initialXdir);

  const title = isEdit ? 'Edit video settings' : 'Trajectory direction';
  const description = isEdit
    ? `Which way does the projectile travel in "${props.videoName}"?`
    : props.fileCount === 1
      ? 'Which way does the projectile travel in this video?'
      : `Which way do the projectiles travel in these ${props.fileCount} videos?`;
  const submitLabel = isEdit ? 'Save' : `Add video${props.fileCount !== 1 ? 's' : ''}`;

  return (
    <div className={overlay.container}>
      <button
        type="button"
        className={overlay.scrim}
        aria-label={isEdit ? 'Cancel' : 'Cancel upload'}
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="xdir-upload-title"
        className={`${overlay.dialog} max-w-sm`}
      >
        <h2 id="xdir-upload-title" className={overlay.dialogTitle}>
          {title}
        </h2>
        <p className={`${text.hint} mb-4`}>
          {description}
        </p>

        <p className={`${text.sectionTitle} mb-2`}>Shooting direction</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setXdir(-1)}
            className={overlay.choice(xdir === -1)}
          >
            ← Left
          </button>
          <button
            type="button"
            onClick={() => setXdir(1)}
            className={overlay.choice(xdir === 1)}
          >
            Right →
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`${button.secondary} flex-1`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(xdir)}
            className={`${button.primary} flex-1`}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
