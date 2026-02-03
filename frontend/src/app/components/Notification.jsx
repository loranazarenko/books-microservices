import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../actions/notificationActions';

const Notification = () => {
    const dispatch = useDispatch();
    const notification = useSelector(state => state.notification || {});
    const { open, message, severity, autoHideMs } = notification;

    useEffect(() => {
        if (open && autoHideMs) {
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, autoHideMs);
            return () => clearTimeout(timer);
        }
    }, [open, autoHideMs, dispatch]);

    if (!open) return null;

    const bgColor = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
    }[severity] || '#2196f3';

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '16px 24px',
                borderRadius: '8px',
                backgroundColor: bgColor,
                color: 'white',
                fontSize: '14px',
                zIndex: 9999,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
            }}
        >
            {message}
        </div>
    );
};

export default Notification;