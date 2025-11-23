import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  id: string;
  error?: boolean;
}

type InputFieldProps = FormFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> & {
    type?: 'text' | 'email' | 'password' | 'number';
    textarea?: false;
  };

type TextareaFieldProps = FormFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> & {
    textarea: true;
  };

type FieldProps = InputFieldProps | TextareaFieldProps;

export const FormField = (props: FieldProps) => {
  const { label, id, error, ...inputProps } = props;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {props.textarea ? (
        <textarea
          id={id}
          className={`${styles.textarea} ${error ? styles.error : ''}`}
          {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          type={props.type || 'text'}
          className={`${styles.input} ${error ? styles.error : ''}`}
          {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};

