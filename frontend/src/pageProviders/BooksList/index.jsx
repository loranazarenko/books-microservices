import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useSearchParams} from 'react-router-dom';
import actionsBooks from '../../app/actions';
import BooksListView from './BooksListView';
import {showNotification} from '../../app/actions/notificationActions';
import {useI18n} from '../../misc/hooks/useI18n';


function BooksList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        items,
        page,
        pageSize,
        totalPages,
        filters,
        isLoadingList,
        isDeleting,
        error,
        deleteError,
        authors,
    } = useSelector(({books}) => books);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);
    const {t, lang, changeLang} = useI18n();

    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get('page')) || 0;
        const titleFromUrl = searchParams.get('title') || '';
        const authorIdFromUrl = searchParams.get('authorId');
        const genreFromUrl = searchParams.get('genre') || '';

        const filtersToApply = {
            title: titleFromUrl,
            authorId: authorIdFromUrl ? parseInt(authorIdFromUrl) : null,
            genre: genreFromUrl,
        };

        dispatch(actionsBooks.books.fetchAuthorsList());

        dispatch(actionsBooks.books.fetchBooksList(pageFromUrl, filtersToApply));
    }, [dispatch, searchParams]);

    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams();
        params.set('page', '0');
        if (newFilters.title) params.set('title', newFilters.title);
        if (newFilters.authorId) params.set('authorId', newFilters.authorId);
        if (newFilters.genre) params.set('genre', newFilters.genre);
        setSearchParams(params);

        dispatch(actionsBooks.books.setFilters(newFilters));
        dispatch(actionsBooks.books.fetchBooksList(0, newFilters));
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);

        dispatch(actionsBooks.books.setPage(newPage));
        dispatch(actionsBooks.books.fetchBooksList(newPage, filters));
    };

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setDeleteDialogOpen(true);
        setDeleteErrorMessage(null);
    };

    const handleConfirmDelete = async () => {
        if (bookToDelete) {
            try {
                await dispatch(actionsBooks.books.deleteBook(bookToDelete.id));
                setDeleteDialogOpen(false);
                setBookToDelete(null);
                setDeleteErrorMessage(null);

                dispatch(showNotification({
                    message: `Book "${bookToDelete.title}" successfully deleted`,
                    severity: 'success'
                }));
            } catch (error) {
                const errorMsg = error.response?.data?.message
                    || error.message
                    || 'Failed to delete book. Please try again.';

                setDeleteErrorMessage(errorMsg);
            }
        }
    };

    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`, {
            state: {returnPage: page, returnFilters: filters}
        });
    };

    const handleAddBook = () => {
        navigate('/books/new', {
            state: {returnPage: page, returnFilters: filters}
        });
    };

    const handleResetFilters = () => {
        dispatch(actionsBooks.books.resetFilters());
        setSearchParams(new URLSearchParams());

        dispatch(actionsBooks.books.fetchBooksList(0, {
            title: '',
            authorId: null,
            genre: '',
        }));
    };

    return (
        <BooksListView
            books={items}
            authors={authors}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            filters={filters}
            isLoading={isLoadingList}
            isDeleting={isDeleting}
            error={error}
            deleteError={deleteError}
            deleteErrorMessage={deleteErrorMessage}
            deleteDialogOpen={deleteDialogOpen}
            bookToDelete={bookToDelete}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onDeleteClick={handleDeleteClick}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={() => {
                setDeleteDialogOpen(false);
                setDeleteErrorMessage(null);
            }}
            onBookClick={handleBookClick}
            onAddBook={handleAddBook}
            onResetFilters={handleResetFilters}
            lang={lang}
            changeLang={changeLang}
            t={t}
        />
    );
}

export default BooksList;
