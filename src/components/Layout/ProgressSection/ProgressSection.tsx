import CheckIcon from '../../../assets/check-icon.svg?react';
import styles from './ProgressSection.module.css';

interface ProgressSectionProps {
  current: number;
  max: number;
}

export const ProgressSection = ({ current, max }: ProgressSectionProps) => {
  const progress = Math.min(current, max);
  const isCompleted = progress >= max;

  return (
    <div className={styles.progressSection}>
      {isCompleted ? (
        <div className={styles.completedState}>
          <span className={styles.progressText}>
            <span className={styles.desktopText}>
              {progress}/{max} applications generated
            </span>
            <span className={styles.mobileText}>
              {progress}/{max}
            </span>
          </span>
          <div className={styles.checkmarkIcon}>
            <CheckIcon />
          </div>
        </div>
      ) : (
        <>
          <span className={styles.progressText}>
            <span className={styles.desktopText}>
              {progress}/{max} applications generated
            </span>
            <span className={styles.mobileText}>
              {progress}/{max}
            </span>
          </span>
          <div className={styles.progressDots}>
            {Array.from({ length: max }).map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${
                  index < progress ? styles.dotFilled : ''
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

