import { feedback, text } from '../styles/theme';

interface ProgressBarProps {
  /** Progress value from 0 to 1. */
  progress: number;
  /** Detail line shown below the bar. */
  detail?: string;
  /** Fill class from the theme (default: feedback.progressFill). */
  fillClassName?: string;
  /** Show "% complete" line (default: true). */
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  detail,
  fillClassName = feedback.progressFill,
  showPercent = true,
  className = '',
}: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <div className={`space-y-1 ${className}`.trim()}>
      <div className={feedback.progressTrack}>
        <div className={fillClassName} style={{ width: `${pct}%` }} />
      </div>
      {detail != null && (
        <p className={`${text.hint} text-center tabular-nums`}>{detail}</p>
      )}
      {showPercent && (
        <p className={`${text.hint} text-center tabular-nums`}>{pct}% complete</p>
      )}
    </div>
  );
}
