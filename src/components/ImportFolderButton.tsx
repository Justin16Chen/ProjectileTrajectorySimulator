import { useRef, useState, useEffect, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import { pickFolderForImport } from '../utils/projectIO';
import { button } from '../styles/theme';

const PICKER_DELAY_MS = 150;

export interface ImportFolderButtonProps {
  label: string;
  busyLabel?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  unsupportedMessage?: string;
  /** Return false to abort before opening the folder picker. */
  onBeforeImport?: () => boolean;
  onCancel?: () => void;
  onError?: (message: string) => void;
  onBusy?: () => void;
  onFolderSelected: (dir: FileSystemDirectoryHandle) => void | Promise<void>;
  actionRef?: React.MutableRefObject<(() => void) | null>;
  busyRef?: React.MutableRefObject<boolean>;
  onImportingChange?: (importing: boolean) => void;
}

export function ImportFolderButton({
  label,
  busyLabel = 'Importing…',
  icon: Icon = FolderOpen,
  disabled = false,
  className = `${button.secondary} ${button.block}`,
  unsupportedMessage,
  onBeforeImport,
  onCancel,
  onError,
  onBusy,
  onFolderSelected,
  actionRef,
  busyRef,
  onImportingChange,
}: ImportFolderButtonProps) {
  const busyInternalRef = useRef(false);
  const [importing, setImporting] = useState(false);

  const setBusy = useCallback(
    (busy: boolean) => {
      busyInternalRef.current = busy;
      if (busyRef) busyRef.current = busy;
      setImporting(busy);
      onImportingChange?.(busy);
    },
    [busyRef, onImportingChange],
  );

  const handleClick = useCallback(() => {
    if (busyInternalRef.current) {
      onBusy?.();
      return;
    }
    if (onBeforeImport && !onBeforeImport()) return;

    setBusy(true);

    window.setTimeout(() => {
      void (async () => {
        try {
          const pick = await pickFolderForImport({ unsupportedMessage });
          if (!pick.ok) {
            if (pick.cancelled) {
              onCancel?.();
            } else if (pick.message) {
              onError?.(pick.message);
            }
            return;
          }
          await onFolderSelected(pick.dir);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          onError?.(`Import failed: ${msg}`);
        } finally {
          setBusy(false);
        }
      })();
    }, PICKER_DELAY_MS);
  }, [
    onBeforeImport,
    onBusy,
    onCancel,
    onError,
    onFolderSelected,
    setBusy,
    unsupportedMessage,
  ]);

  useEffect(() => {
    if (!actionRef) return;
    actionRef.current = handleClick;
    return () => {
      actionRef.current = null;
    };
  }, [actionRef, handleClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || importing}
      className={className}
    >
      <Icon size={14} />
      {importing ? busyLabel : label}
    </button>
  );
}
