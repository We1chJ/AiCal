import React, { ReactNode } from 'react';
import './GlassButton.css';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
}) => (
  <button
    className={`glass-btn glass-btn--${variant}${fullWidth ? ' glass-btn--full' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {variant === 'primary' && <span className="glass-btn__sheen" aria-hidden="true" />}
    {variant === 'primary' && <span className="glass-btn__highlight" aria-hidden="true" />}
    <span className="glass-btn__label">{children}</span>
  </button>
);

export default GlassButton;
