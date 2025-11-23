import { Header } from '../../components/Layout/Header';
import { ApplicationCard } from '../../components/ApplicationCard/ApplicationCard';
import { GoalBanner } from '../../components/GoalBanner/GoalBanner';
import { CreateButton } from '../../components/CreateButton/CreateButton';
import { useApplicationsStore } from '../../stores/useApplicationsStore';
import { GOALS } from '../../constants';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const applications = useApplicationsStore((state) => state.applications);
  const deleteApplication = useApplicationsStore((state) => state.deleteApplication);

  const shouldShowBanner = applications.length < GOALS.MIN_APPLICATIONS;

  return (
    <div className={styles.dashboard}>
      <Header applicationsCount={applications.length} />
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Applications</h1>
          <CreateButton />
        </div>
        {applications.length > 0 && (
          <div className={styles.cardsGrid}>
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onDelete={deleteApplication}
              />
            ))}
          </div>
        )}
        {shouldShowBanner && <GoalBanner applicationsCount={applications.length} />}
      </div>
    </div>
  );
};

