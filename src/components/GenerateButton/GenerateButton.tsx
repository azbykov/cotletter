import LoadingIcon from '../../assets/loading.svg?react';
import RepeatIcon from '../../assets/repeat.svg?react';
import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  disabled?: boolean;
  loading?: boolean;
  repeat?: boolean;
  onClick: () => void;
}

export const GenerateButton = ({
  disabled = false,
  loading = false,
  repeat = false,
  onClick,
}: GenerateButtonProps) => {
  return (
    <button
      className={`${styles.generateButton} ${loading ? styles.loadingButton : ''} ${repeat ? styles.tryAgainButton : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <LoadingIcon width={24} height={24} className={styles.loadingIcon} />
      ) : repeat ? (
        <>
          <RepeatIcon width={24} height={24} />
          Try Again
        </>
      ) : (
        'Generate Now'
      )}
    </button>
  );
};

