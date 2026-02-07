import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import actionsBooks from '../../app/actions';
import BookDetailView from './BookDetailView';
import {showNotification} from '../../app/actions/notificationActions';
import {useI18n} from '../../misc/hooks/useI18n';

function BookDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const location = useLocation();
    const {t} = useI18n();

    const {
        currentBook,
        authors,
        isLoadingDetail,
        isLoadingAuthors,
        isSaving,
        error,
    } = useSelector(({books}) => books);

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [saveNotification, setSaveNotification] = useState(null);
    const isNew = !id || id === 'new';
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        dispatch(actionsBooks.books.fetchAuthorsList());

        if (!isNew) {
            dispatch(actionsBooks.books.fetchBookDetail(id));
        } else {
            const emptyBook = {
                id: null,
                title: '',
                yearPublished: new Date().getFullYear(),
                genres: [],
                author: null,
            };
            setFormData(emptyBook);
            setIsEditMode(true);
        }
        return () => {
            dispatch(actionsBooks.books.clearCurrentBook());
        };

    }, [id, isNew, dispatch]);

    useEffect(() => {
        if (currentBook && !isNew) {
            setFormData(currentBook);
        }
    }, [currentBook, isNew]);

    const validateForm = (data) => {
        const errors = {};

        if (!data.title || data.title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!data.author) {
            errors.author = 'Author is required';
        }

        if (!data.yearPublished || data.yearPublished < 1 || data.yearPublished > 2025) {
            errors.yearPublished = 'Year must be between 1 and 2025';
        }

        return errors;
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        if (isNew) {
            navigate(-1);
        } else {
            setIsEditMode(false);
            setFormData(currentBook);
            setValidationErrors({});
        }
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});

        const payload = {
            id: formData.id,
            title: formData.title,
            yearPublished: formData.yearPublished,
            genres: formData.genres || [],
            authorId: formData.author?.id || formData.author,
        };

        dispatch(actionsBooks.books.saveBook(payload, isNew))
            .then(() => {
                dispatch(showNotification({
                    message: isNew ? t('messages.created') : t('messages.updated'),
                    severity: 'success',
                    autoHideMs: 5000,
                }));
                setIsEditMode(false);
                if (isNew) {
                    navigate('/books');
                }
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || 'Failed to save';
                setFormError(errorMsg);
            });
    };

    const handleBackClick = () => {
        const returnPage = location.state?.returnPage || 0;
        const returnFilters = location.state?.returnFilters || {};

        const params = new URLSearchParams();
        params.set('page', returnPage);
        if (returnFilters.title) params.set('title', returnFilters.title);
        if (returnFilters.authorId) params.set('authorId', returnFilters.authorId);
        if (returnFilters.genre) params.set('genre', returnFilters.genre);

        navigate(`/books?${params.toString()}`);
    };

    if (isLoadingDetail && !isNew) {
        return <div className="loading">Loading book details...</div>;
    }

    if (!formData) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <BookDetailView
            book={formData}
            authors={authors}
            isEditMode={isEditMode}
            isNew={isNew}
            isSaving={isSaving}
            isLoadingAuthors={isLoadingAuthors}
            validationErrors={validationErrors}
            saveNotification={saveNotification}
            error={error}
            onEditClick={handleEditClick}
            onCancelEdit={handleCancelEdit}
            onFormChange={handleFormChange}
            onSave={handleSave}
            onBack={handleBackClick}
            t={t}
            formError={formError}
        />
    );
}

export default BookDetail;
