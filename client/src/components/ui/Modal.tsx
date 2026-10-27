import React, { useEffect } from 'react';

interface ModalProps {
  id?: string;
  show?: boolean;
  isOpen?: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ id = 'modal', show, isOpen, title, onClose, children }: ModalProps) {
  const visible = show !== undefined ? show : isOpen !== undefined ? isOpen : false;

  useEffect(() => {
    if (visible) {
      const el = document.getElementById(id);
      if (el) requestAnimationFrame(() => el.classList.add('show'));
    }
  }, [visible, id]);

  if (!visible) return null;

  return (
    <div
      className={`modal-overlay${visible ? ' show' : ''}`}
      id={id}
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button type="button" className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
