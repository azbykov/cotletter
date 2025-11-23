import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  current: number;
  max: number;
}

export const ProgressIndicator = ({ current, max }: ProgressIndicatorProps) => {
  const progress = Math.min(current, max);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBars}>
        {Array.from({ length: max }).map((_, index) => (
          <div
            key={index}
            className={`${styles.progressBar} ${
              index < progress ? styles.progressBarFilled : ''
            }`}
          />
        ))}
      </div>
      <p className={styles.progressText}>
        {progress} out of {max}
      </p>
    </div>
  );
};

