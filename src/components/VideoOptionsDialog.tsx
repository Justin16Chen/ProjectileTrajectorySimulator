import { useRef, useState } from 'react';
import { FileUp, Settings } from 'lucide-react';
import ModalDialog from './ModalDialog';
import { configFileNameForVideo } from '../utils/projectIO';
import { parseConfigurationFile, type LoadedConfiguration } from '../utils/trajectorySegments';
import type { VideoData } from '../types';
import { button, feedback, text } from '../styles/theme';

interface Props {
  video: VideoData;
  onAttachConfig: (config: LoadedConfiguration) => void;
  onEditSettings: () => void;
  onDismiss: () => void;
}

export default function VideoOptionsDialog({ video, onAttachConfig, onEditSettings, onDismiss }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleConfigFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setStatus(null);
    try {
      const text = await file.text();
      const config = parseConfigurationFile(text);
      if (!config) {
        setStatus({ ok: false, text: `Could not parse "${file.name}". Expected a configuration JSON file.` });
        return;
      }
      onAttachConfig(config);
      onDismiss();
    } catch {
      setStatus({ ok: false, text: `Failed to read "${file.name}".` });
    }
  }

  const expectedConfigName = configFileNameForVideo(video.name);

  return (
    <ModalDialog title={video.name} onDismiss={onDismiss} maxWidthClass="max-w-md">
      <p className={`${text.hint} mb-3`}>
        Select this video for labeling, or attach a saved configuration to load trajectory points and meterstick data.
      </p>
      <p className={`${text.meta} mb-4`}>
        Expected config name: <span className={text.mono}>{expectedConfigName}</span>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleConfigFile}
      />

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${button.secondary} ${button.block}`}
        >
          <FileUp size={16} />
          Attach config file
        </button>
        <button
          type="button"
          onClick={onEditSettings}
          className={`${button.secondary} ${button.block}`}
        >
          <Settings size={16} />
          Edit video settings
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className={`${button.primary} ${button.block}`}
        >
          Continue without config
        </button>
      </div>

      {status && (
        <p className={`mt-3 ${feedback.status(status.ok)}`}>
          {status.text}
        </p>
      )}
    </ModalDialog>
  );
}
