import type { TextareaHTMLAttributes } from 'react';
import styles from './TextareaField.module.css';

interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> {
  label: string;
  id: string;
  value: string;
  maxLength: number;
  error?: boolean;
}

export const TextareaField = ({ label, id, value, maxLength, error, ...textareaProps }: TextareaFieldProps) => {
  const currentLength = value.length;
  const isExceeded = currentLength > maxLength;
  const hasError = error || isExceeded;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${styles.textarea} ${hasError ? styles.error : ''}`}
        value={value}
        rows={8}
        {...textareaProps}
      />
      <div className={`${styles.counter} ${isExceeded ? styles.counterError : ''}`}>
        {currentLength}/{maxLength}
      </div>
    </div>
  );
};

