import {SHOW_NOTIFICATION, HIDE_NOTIFICATION} from '../constants/actionTypes';

const initialState = {
    open: false,
    message: '',
    severity: 'info',
    autoHideMs: 5000,
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {
                open: true,
                message: action.payload.message || '',
                severity: action.payload.severity || 'info',
                autoHideMs: action.payload.autoHideMs ?? 5000,
            };
        case HIDE_NOTIFICATION:
            return { ...state, open: false, message: '' };
        default:
            return state;
    }
}
