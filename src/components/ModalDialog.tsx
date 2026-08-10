import type { ReactNode } from 'react';
import { overlay } from '../styles/theme';

interface Props {
  title: string;
  titleId?: string;
  onDismiss?: () => void;
  dismissAriaLabel?: string;
  children: ReactNode;
  maxWidthClass?: string;
}

export default function ModalDialog({
  title,
  titleId = 'modal-dialog-title',
  onDismiss,
  dismissAriaLabel = 'Close dialog',
  children,
  maxWidthClass = 'max-w-sm',
}: Props) {
  return (
    <div className={overlay.container}>
      {onDismiss && (
        <button
          type="button"
          className={overlay.scrim}
          aria-label={dismissAriaLabel}
          onClick={onDismiss}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${overlay.dialog} ${maxWidthClass}`}
      >
        <h2 id={titleId} className={overlay.dialogTitle}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
