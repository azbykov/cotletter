import { useNavigate, useLocation } from 'react-router-dom';
import PlusIcon from '../../assets/plus.svg?react';
import styles from './CreateButton.module.css';

interface CreateButtonProps {
  className?: string;
  fullWidth?: boolean;
  onResetForm?: () => void;
}

export const CreateButton = ({ className, fullWidth, onResetForm }: CreateButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/generator' && onResetForm) {
      onResetForm();
    } else {
      navigate('/generator');
    }
  };

  return (
    <button
      className={`${styles.createButton} ${className || ''} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={handleClick}
    >
      <PlusIcon width={20} height={20} />
      Create New
    </button>
  );
};

