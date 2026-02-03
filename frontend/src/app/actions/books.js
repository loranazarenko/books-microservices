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
import {booksAxios} from 'misc/requests';

export const fetchAuthorsList = () => {
    return (dispatch) => {
        dispatch({type: REQUEST_AUTHORS_LIST});

        booksAxios
            .get('/api/author')
            .then((response) => {
                dispatch({
                    type: SUCCESS_AUTHORS_LIST,
                    payload: response.data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: ERROR_AUTHORS_LIST,
                    payload: error.response?.data?.message || 'Failed to load authors',
                });
            });
    };
};

export const fetchBooksList = (page = 0, filters = {}) => {
    return (dispatch) => {
        dispatch({type: REQUEST_BOOKS_LIST});

        const payload = {
            page,
            size: 10,
            title: filters.title || '',
            authorId: filters.authorId || null,
            genre: filters.genre || '',
            sortBy: filters.sortBy || 'id',
            sortOrder: filters.sortOrder || 'DESC',
        };

        booksAxios
            .post('/api/book/_list', payload)
            .then((response) => {
                dispatch({
                    type: SUCCESS_BOOKS_LIST,
                    payload: {
                        items: response.data.content,
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        currentPage: response.data.currentPage,
                        pageSize: response.data.pageSize,
                    },
                });
            })
            .catch((error) => {
                dispatch({
                    type: ERROR_BOOKS_LIST,
                    payload: error.response?.data?.message || 'Failed to load books',
                });
            });
    };
};

export const fetchBookDetail = (id) => {
    return (dispatch) => {
        dispatch({type: REQUEST_BOOK_DETAIL});

        booksAxios
            .get(`/api/book/${id}`)
            .then((response) => {
                dispatch({
                    type: SUCCESS_BOOK_DETAIL,
                    payload: response.data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: ERROR_BOOK_DETAIL,
                    payload: error.response?.data?.message || 'Failed to load book',
                });
            });
    };
};

export const saveBook = (bookData, isNew = false) => (dispatch) => {
    dispatch({ type: REQUEST_SAVE_BOOK });

    const request = isNew
        ? booksAxios.post('/api/book', bookData)
        : booksAxios.put(`/api/book/${bookData.id}`, bookData);

    return request
        .then(response => {
            dispatch({ type: SUCCESS_SAVE_BOOK, payload: response.data });
            return response.data;
        })
        .catch(error => {
            dispatch({
                type: ERROR_SAVE_BOOK,
                payload: error.response?.data?.message || 'Failed to save book',
            });
            throw error;
        });
};

export const deleteBook = (id) => (dispatch) => {
    dispatch({ type: REQUEST_DELETE_BOOK });

    return booksAxios
        .delete(`/api/book/${id}`)
        .then(() => {
            dispatch({
                type: SUCCESS_DELETE_BOOK,
                payload: id,
            });
            return id;
        })
        .catch((error) => {
            dispatch({
                type: ERROR_DELETE_BOOK,
                payload: error.response?.data?.message || 'Failed to delete book',
            });
            throw error;
        });
};

export const setFilters = (filters) => ({
    type: SET_FILTERS,
    payload: filters,
});

export const setPage = (page) => ({
    type: SET_PAGE,
    payload: page,
});

export const resetFilters = () => ({
    type: RESET_FILTERS,
});

export const clearCurrentBook = () => ({
    type: CLEAR_CURRENT_BOOK,
});
