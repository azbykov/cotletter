import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';
import { ProgressSection } from './ProgressSection/ProgressSection';
import HomeIconSvg from '../../assets/home.svg?react';
import styles from './Header.module.css';

interface HeaderProps {
  applicationsCount: number;
}

export const Header = ({ applicationsCount }: HeaderProps) => {
  const maxApplications = 5;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logo}>
              <Logo size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>Alt+Shift</span>
            </Link>
          </div>
        </div>
        <div className={styles.rightSection}>
          <ProgressSection current={applicationsCount} max={maxApplications} />
          <Link to="/" className={styles.homeIcon}>
            <HomeIconSvg width={20} height={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

