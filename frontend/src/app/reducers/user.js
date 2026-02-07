import {
    ERROR_RECEIVE_USER,
    ERROR_SIGN_IN,
    ERROR_SIGN_UP,
    RECEIVE_USER,
    REQUEST_SIGN_OUT,
    REQUEST_SIGN_IN,
    REQUEST_SIGN_UP,
    REQUEST_USER,
    SUCCESS_SIGN_IN,
    SUCCESS_SIGN_UP,
    REQUEST_PROFILE,
    RECEIVE_PROFILE,
    ERROR_PROFILE,
} from '../constants/actionTypes';

const initialState = {
    authorities: [],
    firstName: '',
    email: '',
    errors: [],
    id: '',
    isAuthorized: false,
    isFailedSignIn: false,
    isFailedSignUp: false,
    isFetchingSignIn: false,
    isFetchingSignUp: false,
    isFetchingUser: false,
    lastName: '',
    login: '',
    user: null,
};

const convertErrors = errors => errors.map(error => ({
    code: error.code,
    description: error.description,
}));

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case ERROR_SIGN_IN: {
            return {
                ...state,
                errors: convertErrors(action.payload),
                isFailedSignIn: true,
                isFetchingSignIn: false,
            };
        }

        case ERROR_SIGN_UP: {
            return {
                ...state,
                errors: convertErrors(action.payload),
                isFailedSignUp: true,
                isFetchingSignUp: false,
            };
        }

        case RECEIVE_USER:
        case SUCCESS_SIGN_IN: {
            const user = action.payload;

            return {
                ...state,
                authorities: user.authorities || initialState.authorities,
                email: user.email || initialState.email,
                firstName: user.firstName || initialState.firstName,
                id: user.id || initialState.id,
                isAuthorized: true,
                isFetchingSignIn: false,
                isFetchingUser: false,
                lastName: user.lastName || initialState.lastName,
                login: user.login || initialState.login,
            };
        }

        case SUCCESS_SIGN_UP: {
            return {
                ...state,
                isFetchingSignUp: false,
            };
        }

        case ERROR_RECEIVE_USER:
        case REQUEST_SIGN_OUT: {
            return initialState;
        }

        case REQUEST_SIGN_IN: {
            return {
                ...state,
                errors: initialState.errors,
                isFailedSignIn: false,
                isFetchingSignIn: true,
            }
        }

        case REQUEST_USER: {
            return {
                ...state,
                isFetchingUser: true,
            };
        }

        case REQUEST_SIGN_UP: {
            return {
                ...state,
                errors: initialState.errors,
                isFetchingSignUp: true,
                isFailedSignUp: false,
            }
        }

        case REQUEST_PROFILE:
            return {
                ...state,
                isFetchingUser: true,
            };

        case RECEIVE_PROFILE:
            return {
                ...state,
                isFetchingUser: false,
                user: action.payload,
                isAuthorized: true,
                errors: [],
            };

        case ERROR_PROFILE:
            return {
                ...state,
                isFetchingUser: false,
                isAuthorized: false,
                user: null,
                errors: [action.payload],
            };

        default: {
            return state;
        }
    }
}
