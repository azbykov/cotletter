import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationCard } from './ApplicationCard';
import type { Application } from '../../types';

describe('ApplicationCard', () => {
  const mockApplication: Application = {
    id: '1',
    jobTitle: 'Developer',
    company: 'Tech Corp',
    skills: 'React, TypeScript',
    additionalDetails: 'Some details',
    letterText: 'This is a test letter text.',
    createdAt: Date.now(),
  };

  it('should render application letter text', () => {
    const onDelete = vi.fn();

    render(<ApplicationCard application={mockApplication} onDelete={onDelete} />);

    expect(screen.getByText('This is a test letter text.')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<ApplicationCard application={mockApplication} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should render delete button', () => {
    const onDelete = vi.fn();

    render(<ApplicationCard application={mockApplication} onDelete={onDelete} />);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should render CopyToClipboard component', () => {
    const onDelete = vi.fn();

    render(<ApplicationCard application={mockApplication} onDelete={onDelete} />);

    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
  });
});

