import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../constants/actionTypes';

/**
 * payload: { message: string, severity: 'success'|'error'|'info'|'warning', autoHideMs?: number }
 */
export const showNotification = (payload) => ({
    type: SHOW_NOTIFICATION,
    payload,
});

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});
