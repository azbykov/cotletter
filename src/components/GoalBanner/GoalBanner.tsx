import { CreateButton } from '../CreateButton/CreateButton';
import { ProgressIndicator } from './ProgressIndicator/ProgressIndicator';
import styles from './GoalBanner.module.css';

interface GoalBannerProps {
  applicationsCount: number;
  onResetForm?: () => void;
}

export const GoalBanner = ({ applicationsCount, onResetForm }: GoalBannerProps) => {
  const maxApplications = 5;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h2 className={styles.title}>Hit your goal</h2>
        <p className={styles.description}>
          Generate and send out couple more job applications today to get hired faster
        </p>
        <CreateButton className={styles.createButton} onResetForm={onResetForm} />
        <ProgressIndicator current={applicationsCount} max={maxApplications} />
      </div>
    </div>
  );
};

