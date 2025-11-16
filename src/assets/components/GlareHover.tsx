import React from 'react';
import './GlareHover.css';

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;       // aceita "transparent"
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  width = '16rem',
  height = '3rem',
  background = 'transparent', // <- <--- DEFAULT TRANSPARENTE
  borderRadius = '0.5rem',
  borderColor = 'rgba(255,255,255,0.06)',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.35,
  glareAngle = -30,
  glareSize = 200,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = (glareColor || '#ffffff').replace('#', '');
  let rgba = glareColor;

  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else {
    rgba = `rgba(255,255,255,${glareOpacity})`;
  }

  // garante que a variável --gh-bg será "transparent" se receber undefined/null
  const vars: React.CSSProperties & { [k: string]: string } = {
    '--gh-width': width,
    '--gh-height': height,
    '--gh-bg': background ?? 'transparent',
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor
  };

  // aplicamos vars primeiro e permitimos override por props.style
  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={{ ...(vars as any), ...(style || {}) } as React.CSSProperties}
      aria-hidden={false}
    >
      {children}
    </div>
  );
};

export default GlareHover;
