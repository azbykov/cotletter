import { memo, useCallback } from 'react';
import CopyIcon from '../../assets/copy.svg?react';
import styles from './CopyToClipboard.module.css';

interface CopyToClipboardProps {
  text: string;
  disabled?: boolean;
}

export const CopyToClipboard = memo(({ text, disabled = false }: CopyToClipboardProps) => {
  const handleCopy = useCallback(async () => {
    if (disabled || !text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [disabled, text]);

  return (
    <button
      type="button"
      className={`${styles.copyLink} ${disabled ? styles.copyLinkDisabled : styles.copyLinkActive}`}
      onClick={handleCopy}
      disabled={disabled}
      aria-label="Copy to clipboard"
    >
      Copy to clipboard
      <CopyIcon width={20} height={20} />
    </button>
  );
});

CopyToClipboard.displayName = 'CopyToClipboard';

