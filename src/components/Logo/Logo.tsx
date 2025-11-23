import LogoSvg from '../../assets/logo.svg?react';

interface LogoProps {
  color?: string;
  size?: number;
  className?: string;
}

export const Logo = ({ color = 'var(--color-primary)', size = 24, className }: LogoProps) => {
  return (
    <LogoSvg
      className={className}
      width={size}
      height={size}
      style={{ color }}
    />
  );
};
