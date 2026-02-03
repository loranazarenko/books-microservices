import {
    REQUEST_BOOKS_LIST,
    SUCCESS_BOOKS_LIST,
    ERROR_BOOKS_LIST,
    REQUEST_BOOK_DETAIL,
    SUCCESS_BOOK_DETAIL,
    ERROR_BOOK_DETAIL,
    REQUEST_SAVE_BOOK,
    SUCCESS_SAVE_BOOK,
    ERROR_SAVE_BOOK,
    REQUEST_DELETE_BOOK,
    SUCCESS_DELETE_BOOK,
    ERROR_DELETE_BOOK,
    SET_FILTERS,
    SET_PAGE,
    RESET_FILTERS,
    REQUEST_AUTHORS_LIST,
    SUCCESS_AUTHORS_LIST,
    ERROR_AUTHORS_LIST,
    CLEAR_CURRENT_BOOK,
} from '../constants/actionTypes';

const initialState = {
    items: [],
    page: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    filters: {
        title: '',
        authorId: null,
        genre: '',
    },
    sortBy: 'id',
    sortOrder: 'DESC',
    currentBook: null,
    authors: [],
    isLoadingList: false,
    isLoadingDetail: false,
    isLoadingAuthors: false,
    isDeleting: false,
    isSaving: false,
    error: null,
    deleteError: null,
};

export default function booksReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_BOOKS_LIST:
            return {
                ...state,
                isLoadingList: true,
                error: null,
            };

        case SUCCESS_BOOKS_LIST:
            return {
                ...state,
                isLoadingList: false,
                items: action.payload.items,
                totalPages: action.payload.totalPages,
                totalElements: action.payload.totalElements,
                page: action.payload.currentPage,
                pageSize: action.payload.pageSize,
            };

        case ERROR_BOOKS_LIST:
            return {
                ...state,
                isLoadingList: false,
                error: action.payload,
                items: [],
            };

        case REQUEST_BOOK_DETAIL:
            return {
                ...state,
                isLoadingDetail: true,
                error: null,
            };

        case SUCCESS_BOOK_DETAIL:
            return {
                ...state,
                isLoadingDetail: false,
                currentBook: action.payload,
            };

        case ERROR_BOOK_DETAIL:
            return {
                ...state,
                isLoadingDetail: false,
                error: action.payload,
            };

        case REQUEST_SAVE_BOOK:
            return {
                ...state,
                isSaving: true,
                error: null,
            };

        case SUCCESS_SAVE_BOOK:
            return {
                ...state,
                isSaving: false,
                currentBook: action.payload,
            };

        case ERROR_SAVE_BOOK:
            return {
                ...state,
                isSaving: false,
                error: action.payload,
            };

        case REQUEST_DELETE_BOOK:
            return {
                ...state,
                isDeleting: true,
                deleteError: null,
            };

        case SUCCESS_DELETE_BOOK:
            return {
                ...state,
                isDeleting: false,
                items: state.items.filter(book => book.id !== action.payload),
                totalElements: state.totalElements - 1,
            };

        case ERROR_DELETE_BOOK:
            return {
                ...state,
                isDeleting: false,
                deleteError: action.payload,
            };

        case SET_FILTERS:
            return {
                ...state,
                filters: action.payload,
                page: 0,
            };

        case SET_PAGE:
            return {
                ...state,
                page: action.payload,
            };

        case RESET_FILTERS:
            return {
                ...state,
                filters: initialState.filters,
                page: 0,
            };

        case REQUEST_AUTHORS_LIST:
            return {
                ...state,
                isLoadingAuthors: true,
            };

        case SUCCESS_AUTHORS_LIST:
            return {
                ...state,
                isLoadingAuthors: false,
                authors: action.payload,
            };

        case ERROR_AUTHORS_LIST:
            return {
                ...state,
                isLoadingAuthors: false,
                authors: [],
            };

        case CLEAR_CURRENT_BOOK:
            return {
                ...state,
                currentBook: null,
            };

        default:
            return state;
    }
}
