import React, {useState} from 'react';
import './BooksListView.css';

function BooksListView({
                           books,
                           authors,
                           page,
                           pageSize,
                           totalPages,
                           filters,
                           isLoading,
                           isDeleting,
                           error,
                           deleteError,
                           deleteDialogOpen,
                           bookToDelete,
                           onFilterChange,
                           onPageChange,
                           onDeleteClick,
                           onConfirmDelete,
                           onCancelDelete,
                           onBookClick,
                           onAddBook,
                           onResetFilters,
                           lang,
                           changeLang,
                           t,
                           deleteErrorMessage,
                       }) {

    const [filterOpen, setFilterOpen] = useState(false);

    const [filterDraft, setFilterDraft] = useState(filters);

    const handleApplyFilters = () => {
        onFilterChange(filterDraft);
        setFilterOpen(false);
    };

    const handleCancelFilters = () => {
        setFilterDraft(filters);
        setFilterOpen(false);
    };

    return (
        <div className="books-list-page">
            {error && !isLoading && (
                <div className="error-banner">
                    <p>Error loading books: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}
            <div style={{marginBottom: '20px', textAlign: 'right'}}>
                <label>{t('page.language')}: </label>
                <select value={lang} onChange={(e) => changeLang(e.target.value)}>
                    <option value="en">English</option>
                    <option value="ua">Українська</option>
                </select>
            </div>
            <div className="books-header">
                <h1>{t('books.list.title')}</h1>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={onAddBook}
                        disabled={isLoading}
                    >
                        + {t('books.list.add')}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        {t('books.list.filter')}
                    </button>
                </div>
            </div>

            {filterOpen && (
                <div className="filter-panel">
                    <div className="filter-group">
                        <label>{t('books.form.title')}</label>
                        <input
                            type="text"
                            value={filterDraft.title}
                            onChange={(e) =>
                                setFilterDraft({...filterDraft, title: e.target.value})
                            }
                            placeholder={t('books.list.searchtitle')}
                        />
                    </div>

                    <div className="filter-group">
                        <label>{t('books.form.author')}</label>
                        <select
                            value={filterDraft.authorId || ''}
                            onChange={(e) =>
                                setFilterDraft({
                                    ...filterDraft,
                                    authorId: e.target.value ? parseInt(e.target.value) : null,
                                })
                            }
                        >
                            <option value="">{t('books.list.selectauthor')}</option>
                            {authors?.map(author => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>{t('books.list.genre')}</label>
                        <input
                            type="text"
                            value={filterDraft.genre}
                            onChange={(e) =>
                                setFilterDraft({...filterDraft, genre: e.target.value})
                            }
                            placeholder={t('books.list.searchgenre')}
                        />
                    </div>

                    <div className="filter-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleApplyFilters}
                        >
                            {t('books.list.delete')}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancelFilters}
                        >
                            {t('books.list.appfilter')}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={onResetFilters}
                        >
                            {t('books.list.resfilter')}
                        </button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="loading">Loading books...</div>
            )}

            {!isLoading && books.length === 0 && (
                <div className="empty-state">
                    <p>No books found</p>
                    <button className="btn btn-primary" onClick={onAddBook}>
                        {t('books.list.createfirstbook')}
                    </button>
                </div>
            )}

            {!isLoading && books.length > 0 && (
                <div className="books-list">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="book-item"
                            onMouseEnter={(e) =>
                                e.currentTarget.querySelector('.delete-btn').style.opacity = '1'
                            }
                            onMouseLeave={(e) =>
                                e.currentTarget.querySelector('.delete-btn').style.opacity = '0'
                            }
                        >
                            <div
                                className="book-content"
                                onClick={() => onBookClick(book.id)}
                            >
                                <h3>{book.title}</h3>
                                <p className="book-author">{t('books.form.author')}: {book.authorName}</p>
                                <p className="book-year">{t('books.form.year')}: {book.yearPublished}</p>
                            </div>

                            <button
                                className="delete-btn"
                                onClick={() => onDeleteClick(book)}
                                title="Delete book"
                                disabled={isDeleting}
                            >
                                🗑️ {t('books.list.delete')}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                    >
                        {t('books.list.previous')}
                    </button>

                    <span className="page-info">
            {t('page.page')} {page + 1} {t('page.of')} {totalPages}
          </span>

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => onPageChange(page + 1)}
                    >
                        {t('books.list.next')}
                    </button>
                </div>
            )}

            {deleteDialogOpen && (
                <div className="modal-overlay" onClick={onCancelDelete}>
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Confirm Delete</h2>
                        <p>{t('messages.confirm_delete')}</p>
                        {bookToDelete && <p><strong>"{bookToDelete.title}"</strong></p>}

                        {deleteErrorMessage && (
                            <div style={{
                                backgroundColor: '#ffebee',
                                border: '1px solid #ef5350',
                                borderRadius: '4px',
                                padding: '12px',
                                marginTop: '12px',
                                color: '#c62828',
                                fontSize: '14px',
                            }}>
                                ⚠️ {deleteErrorMessage}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="btn btn-danger"
                                onClick={onConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : t('books.list.delete')}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={onCancelDelete}
                                disabled={isDeleting}
                            >
                                {t('books.list.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BooksListView;
