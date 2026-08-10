import { control } from '../styles/theme';

export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  options: SegmentedToggleOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export default function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  className = '',
}: Props<T>) {
  return (
    <div className={`${control.segmentedGroup} ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={control.segmentedItem(active)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
