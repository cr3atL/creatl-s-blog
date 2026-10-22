import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { motion } from '../../../motion/tokens';
import { playCatalogMotion } from '../hooks/useCatalogMotion';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  className: 'song-catalog-filter' | 'song-catalog-detail';
  children: ReactNode;
}

export default function CatalogDialog({ open, onClose, label, className, children }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const content = useRef(children);
  const [present, setPresent] = useState(open);
  const reducedMotion = useReducedMotion();
  const previous = useRef({ open, reducedMotion });
  if (open) content.current = children;
  // Focus follows the logical open state, never the exit animation lifetime.
  useFocusTrap(open, onClose, panelRef);

  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = { open, reducedMotion };
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;
    if (open) setPresent(true);
    if (reducedMotion) {
      if (!open) setPresent(false);
      return;
    }
    if (open && before.open && before.reducedMotion) return;
    let cancelled = false;
    const options = {
      duration: open ? motion.duration.standard : motion.duration.fast,
      easing: open ? motion.easing.enter : motion.easing.exit,
      fill: 'both' as const,
    };
    const maskAnimation = playCatalogMotion(backdrop,
      [{ opacity: open ? 0 : 1 }, { opacity: open ? 1 : 0 }], options);
    const panelAnimation = playCatalogMotion(panel,
      [{ transform: open ? 'scale(.98)' : 'scale(1)' }, { transform: open ? 'scale(1)' : 'scale(.98)' }], options);
    if (!open) {
      if (maskAnimation) maskAnimation.onfinish = () => { if (!cancelled) setPresent(false); };
      else setPresent(false);
    }
    return () => {
      cancelled = true;
      if (maskAnimation) { maskAnimation.onfinish = null; maskAnimation.cancel(); }
      panelAnimation?.cancel();
    };
  }, [open, reducedMotion]);

  if (!open && !present) return null;
  return (
    <div ref={backdropRef} className={`${className}__backdrop`}
      data-catalog-dialog-state={open ? 'open' : 'exiting'}
      role={open ? 'dialog' : 'presentation'} aria-modal={open || undefined}
      aria-label={open ? label : undefined} aria-hidden={!open || undefined} inert={!open}
      onClickCapture={!open ? (event) => event.stopPropagation() : undefined}
      onKeyDownCapture={!open ? (event) => { event.preventDefault(); event.stopPropagation(); } : undefined}
      onClick={open ? (event) => { if (event.target === event.currentTarget) onClose(); } : undefined}>
      <div ref={panelRef} className={`${className}__panel`} role="document" tabIndex={-1}>
        {open ? children : content.current}
      </div>
    </div>
  );
}
