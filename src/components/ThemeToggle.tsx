import { Moon, Sun } from 'lucide-react';
import { toggleThemeMode, useThemeMode } from '../styles/themeMode';
import { button } from '../styles/theme';

/** Switches the app between light and dark. Lives beside the wordmark. */
export default function ThemeToggle() {
  const mode = useThemeMode();
  const nextLabel = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleThemeMode}
      className={button.icon}
      title={nextLabel}
      aria-label={nextLabel}
      aria-pressed={mode === 'dark'}
    >
      {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
