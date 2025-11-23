import { memo, useCallback } from 'react';
import type { Application } from '../../types';
import TrashIcon from '../../assets/trash.svg?react';
import { CopyToClipboard } from '../CopyToClipboard/CopyToClipboard';
import styles from './ApplicationCard.module.css';

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: string) => void;
}

export const ApplicationCard = memo(({ application, onDelete }: ApplicationCardProps) => {
  const handleDelete = useCallback(() => {
    onDelete(application.id);
  }, [application.id, onDelete]);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <p className={styles.text}>{application.letterText}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.deleteButton} onClick={handleDelete}>
          <TrashIcon width={20} height={20} />
          Delete
        </button>
        <CopyToClipboard text={application.letterText} />
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

