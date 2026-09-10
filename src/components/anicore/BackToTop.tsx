'use client';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'var(--ink)',
        color: 'var(--paper-strong)',
        border: '1px solid var(--line-dark)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        transition: 'all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        animation: 'card-rise 200ms ease both',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--cobalt)';
        e.currentTarget.style.borderColor = 'var(--cobalt)';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--ink)';
        e.currentTarget.style.borderColor = 'var(--line-dark)';
        e.currentTarget.style.color = 'var(--paper-strong)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <ArrowUp style={{ width: 18, height: 18 }} />
    </button>
  );
}
