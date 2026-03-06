import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    as?: 'button' | 'a';
    href?: string;
    children: React.ReactNode;
}

/**
 * Reusable Button component with primary, secondary, and ghost variants.
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    as = 'button',
    href,
    children,
    className = '',
    ...props
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
        className,
    ].filter(Boolean).join(' ');

    if (as === 'a') {
        return <a href={href} className={classes}>{children}</a>;
    }
    return <button className={classes} {...props}>{children}</button>;
};

interface BadgeProps {
    variant?: 'green' | 'yellow' | 'gray' | 'blue';
    children: React.ReactNode;
    className?: string;
}

/**
 * Status badge — done (green), in-progress (yellow), not-started (gray).
 */
export const Badge: React.FC<BadgeProps> = ({
    variant = 'gray',
    children,
    className = '',
}) => {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
};

interface CardProps {
    children: React.ReactNode;
    interactive?: boolean;
    className?: string;
    onClick?: () => void;
}

/**
 * Base Card component with optional interactive hover styles.
 */
export const Card: React.FC<CardProps> = ({
    children,
    interactive = false,
    className = '',
    onClick,
}) => {
    return (
        <div
            className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

/**
 * Modal skeleton with overlay, header, body, and footer slots.
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm"
                        aria-label="Close modal"
                        style={{ padding: '0.25rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};
