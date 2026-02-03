import React from 'react';
import './BookDetailView.css';

function BookDetailView({
                            book,
                            authors,
                            isEditMode,
                            isNew,
                            isSaving,
                            isLoadingAuthors,
                            validationErrors,
                            saveNotification,
                            error,
                            onEditClick,
                            onCancelEdit,
                            onFormChange,
                            onSave,
                            onBack,
                            t,
                            formError,
                        }) {
    return (
        <div className="book-detail-page">
            {saveNotification && (
                <div className={`notification notification-${saveNotification.type}`}>
                    {saveNotification.message}
                </div>
            )}

            {formError && (
                <div style={{backgroundColor: '#ffebee', color: '#c62828', padding: '16px'}}>
                    ⚠️ Error: {formError}
                </div>
            )}

            {error && !isEditMode && (
                <div className="error-banner">
                    <p>Error loading book: {error}</p>
                </div>
            )}

            <div className="detail-header">
                <button className="btn-back" onClick={onBack}>
                    {t('books.detail.back')}
                </button>
                <h1>{isNew ? t('books.detail.createbook') : t('books.detail.title')}</h1>
                {!isEditMode && !isNew && (
                    <button className="btn-edit" onClick={onEditClick}>
                        {t('books.list.edit')}
                    </button>
                )}
            </div>

            <div className="detail-container">
                <div className="detail-card">
                    {isEditMode ? (
                        <div className="form-group">
                            <div className="form-field">
                                <label>{t('books.form.title')} *</label>
                                <input
                                    type="text"
                                    value={book.title}
                                    onChange={(e) => onFormChange('title', e.target.value)}
                                    className={validationErrors.title ? 'input-error' : ''}
                                />
                                {validationErrors.title && (
                                    <span className="error-text">{validationErrors.title}</span>
                                )}
                            </div>

                            <div className="form-field">
                                <label>{t('books.form.author')} *</label>
                                <select
                                    value={book.author?.id || ''}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                        const selectedAuthor = authors.find(a => a.id === selectedId);
                                        onFormChange('author', selectedAuthor || null);
                                    }}
                                    className={validationErrors.author ? 'input-error' : ''}
                                    disabled={isLoadingAuthors}
                                >
                                    <option value="">Select an author</option>
                                    {authors.map(author => (
                                        <option key={author.id} value={author.id}>
                                            {author.name} ({author.country || 'Unknown'})
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.author && (
                                    <span className="error-text">{validationErrors.author}</span>
                                )}
                            </div>

                            <div className="form-field">
                                <label>{t('books.form.year')} *</label>
                                <input
                                    type="number"
                                    value={book.yearPublished}
                                    onChange={(e) => onFormChange('yearPublished', parseInt(e.target.value))}
                                    min="1"
                                    max="2025"
                                    className={validationErrors.yearPublished ? 'input-error' : ''}
                                />
                                {validationErrors.yearPublished && (
                                    <span className="error-text">{validationErrors.yearPublished}</span>
                                )}
                            </div>

                            <div className="form-field">
                                <label>{t('books.form.genres')}</label>
                                <input
                                    type="text"
                                    value={(book.genres || []).join(', ')}
                                    onChange={(e) =>
                                        onFormChange('genres', e.target.value.split(',').map(g => g.trim()))
                                    }
                                    placeholder="Separate by comma"
                                />
                                <small>e.g. Fiction, Mystery, Romance</small>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={onSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : (isNew ? t('books.detail.create') : t('books.detail.save'))}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={onCancelEdit}
                                    disabled={isSaving}
                                >
                                    {t('books.detail.cancel')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="view-group">
                            <div className="view-field">
                                <label>{t('books.form.title')}</label>
                                <p>{book.title}</p>
                            </div>

                            <div className="view-field">
                                <label>{t('books.form.author')}</label>
                                <p>
                                    {book.author?.name}
                                    {book.author?.country && ` (${book.author.country})`}
                                </p>
                            </div>

                            <div className="view-field">
                                <label>{t('books.form.year')}</label>
                                <p>{book.yearPublished}</p>
                            </div>

                            {book.genres && book.genres.length > 0 && (
                                <div className="view-field">
                                    <label>Genres</label>
                                    <div className="genres-list">
                                        {book.genres.map((genre, idx) => (
                                            <span key={idx} className="genre-tag">
                        {genre}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookDetailView;
