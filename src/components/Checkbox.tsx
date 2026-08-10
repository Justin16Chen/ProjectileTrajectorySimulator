import { control, text } from '../styles/theme';

export type CheckboxColor = 'blue' | 'green';

const checkboxColorClass: Record<CheckboxColor, string> = {
  blue: control.checkbox,
  green: control.checkboxPositive,
};

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  color?: CheckboxColor;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  color = 'blue',
  className = '',
  id,
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className={`${checkboxColorClass[color]} ${className}`.trim()}
    />
  );
}

export interface CheckboxLabelProps extends CheckboxProps {
  label: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
  title?: string;
}

export function CheckboxLabel({
  label,
  labelClassName = text.labelInline,
  wrapperClassName = '',
  disabled = false,
  title,
  ...checkboxProps
}: CheckboxLabelProps) {
  return (
    <label
      title={title}
      className={`${
        disabled ? control.checkboxRowDisabled : control.checkboxRow
      } ${wrapperClassName}`.trim()}
    >
      <Checkbox disabled={disabled} {...checkboxProps} />
      <span className={labelClassName}>{label}</span>
    </label>
  );
}
