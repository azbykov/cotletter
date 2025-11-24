import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyToClipboard } from './CopyToClipboard';

describe('CopyToClipboard', () => {
  beforeEach(() => {
    // Мокаем navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render copy button', () => {
    render(<CopyToClipboard text="Test text" />);

    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
  });

  it('should copy text to clipboard when clicked', async () => {
    const user = userEvent.setup();
    const text = 'Text to copy';
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<CopyToClipboard text={text} />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(button);

    // Ждем завершения асинхронной операции
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(writeTextSpy).toHaveBeenCalledWith(text);
    writeTextSpy.mockRestore();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CopyToClipboard text="Test text" disabled />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toBeDisabled();
  });

  it('should not copy when disabled', () => {
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    
    render(<CopyToClipboard text="Test text" disabled />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toBeDisabled();
    expect(writeTextSpy).not.toHaveBeenCalled();
    
    writeTextSpy.mockRestore();
  });

  it('should not copy when text is empty', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    render(<CopyToClipboard text="" />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(button);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(writeTextSpy).not.toHaveBeenCalled();
    
    writeTextSpy.mockRestore();
  });

  it('should handle clipboard errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
      },
      writable: true,
      configurable: true,
    });

    render(<CopyToClipboard text="Test text" />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(button);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

