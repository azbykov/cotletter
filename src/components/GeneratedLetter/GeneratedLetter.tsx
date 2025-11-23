import { CopyToClipboard } from '../CopyToClipboard/CopyToClipboard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './GeneratedLetter.module.css';

interface GeneratedLetterProps {
  letterText: string;
  isGenerating?: boolean;
  onBackToForm?: () => void;
  showOnMobile?: boolean;
}

export const GeneratedLetter = ({ letterText, isGenerating = false, onBackToForm, showOnMobile = false }: GeneratedLetterProps) => {
  return (
    <div className={`${styles.container} ${showOnMobile ? styles.show : ''}`}>
      {isGenerating ? (
        <LoadingSpinner />
      ) : letterText ? (
        <>
          {onBackToForm && showOnMobile && (
            <button className={styles.editButton} onClick={onBackToForm}>
              Edit
            </button>
          )}
          {onBackToForm && !showOnMobile && (
            <button className={styles.editButton} onClick={onBackToForm}>
              Edit
            </button>
          )}
          <div className={styles.content}>
            <p className={styles.text}>{letterText}</p>
          </div>
          {showOnMobile ? (
            <div className={styles.mobileActions}>
              <CopyToClipboard text={letterText} />
            </div>
          ) : (
            <CopyToClipboard text={letterText} />
          )}
        </>
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>
            Your personalized job application will appear here...
          </p>
          <CopyToClipboard text="" disabled />
        </div>
      )}
    </div>
  );
};

