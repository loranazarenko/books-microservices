# A comprehensive React-based frontend application demonstrating modern web development practices with CRUD operations, state management, and internationalization.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Requirements Implementation](#requirements-implementation)
- [Internationalization](#internationalization)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Setup & Installation](#setup--installation)
- [Testing Checklist](#testing-checklist)
- [API Endpoints](#api-endpoints)

---

## Overview

This project implements a modern React-based frontend application for managing books with:

- Complete CRUD operations (Create, Read, Update, Delete)
- Advanced filtering and pagination
- Full internationalization (English & Ukrainian)
- Responsive and accessible UI
- Redux state management
- Form validation with error handling
- State persistence across page reloads

**Base Template:** [ui-base-app-next](https://github.com/IvanovAAKh/ui-base-app-next)

**Domain:** Books Management System (Books, Authors, Genres)

---

## Project Structure

```
src/
├── app/
│   ├── actions/                    # Redux action creators
│   ├── components/                 # Reusable UI components
│   ├── constants/                  # App-level constants
│   ├── containers/                 # Container/smart components
│   └── reducers/                   # Redux reducers
│
├── components/                     # Shared UI components library
│   ├───Button
│   ├───Card
│   ├───CardActions
│   ├───CardContent
│   ├───CardTitle
│   ├───CircularProgress
│   ├───Dialog
│   ├───Hover
│   ├───IconButton
│   ├───icons
│   ├───Link
│   ├───Loading
│   ├───Logo
│   ├───Menu
│   ├───MenuItem
│   ├───Select
│   ├───SvgIcon
│   ├───SwipeableDrawer
│   ├───TextField
│   └───Typography
│
├── config/                         # Application configuration
│
├── constants/                      # Global constants
│
├── intl/                           # Internationalization (i18n)
│   ├── index.js                    # i18n configuration
│   ├── messages.json               # English translations
│   └── messages.ua.json            # Ukrainian translations
│
├───misc
│   ├───components
│   ├───constants
│   ├───hooks
│   ├───intl/
│   │   ├── messages.js                 # mixMessages utility
│   ├───providers
│   │   ├───AuthoritiesProvider
│   │   ├───IntlProvider
│   │   ├───ThemeProvider
│   │   │   └───themes
│   │   └───UserProvider
│   ├── redux/                      # Redux utilities
│   ├── requests/                   # API request helpers
│   └── storage/                    # Local storage utilities
│
├── pageProviders/                  # Page-level container components
│   ├── BookDetail/                 # Book detail page logic
│   ├── BooksList/                  # Books list page logic
│   └── components/                 # Page-specific components
│
├── pages/                          # Page components (routing)
│   ├── default/
│   │   ├── containers/
│   │   └── intl/
│   ├── login/
│   │   ├── constants/
│   │   ├── containers/
│   │   └── intl/
│   └── secret/
│       ├── containers/
│       └── intl/
│
└── index.js         

```

---

## Requirements Implementation

### 1. Base Project Template

The project uses the ui-base-app-next template as foundation:

| Component | Purpose |
|-----------|---------|
| React with Hooks | Modern component development |
| Redux | Centralized state management |
| React Router v6 | Client-side navigation |
| Notification System | User feedback and alerts |

---

### 2. Page 1: Books List (Entity List)

**URL:** `/books`

#### 2.1 Entity Display

Displays books with essential fields in responsive layout:

- Book title
- Author name
- Year published
- Genres (comma-separated)

Each book row is clickable and navigates to the detail page.

---

#### 2.2 Delete Functionality with Confirmation

Delete flow:

1. Hover on book row - Delete button (trash icon) appears
2. Click delete - Confirmation dialog opens
3. Confirm - API request sent
4. Success - Item removed from list, success notification (4s auto-hide)
5. Error - Dialog stays open, error message displayed

Code example:

```javascript
const handleDelete = (bookId) => {
  setDeleteConfirmation({ open: true, bookId });
};

const confirmDelete = () => {
  dispatch(actionsBooks.books.deleteBook(deleteConfirmation.bookId))
    .then(() => {
      dispatch(showNotification({
        message: t('messages.deleted'),
        severity: 'success',
        autoHideMs: 5000,
      }));
      setBooks(books.filter(b => b.id !== deleteConfirmation.bookId));
    })
    .catch((error) => {
      dispatch(showNotification({
        message: error.response?.data?.message || t('messages.deleteFailed'),
        severity: 'error',
      }));
    });
};
```

---

#### 2.3 Navigation to Detail Page

- Click on book row - Navigate to `/books/:id`
- Route handles both view and edit modes
- Preserves list state for return navigation

---

#### 2.4 Add New Entity Button

- "Add Book" button in header or toolbar
- Click - Navigate to `/books/new`
- Detail page opens in edit mode automatically
- All fields empty and ready for input

---

#### 2.5 Filter Functionality

Filter panel with 3+ fields:

| Field | Type | Backend |
|-------|------|---------|
| Title | Text Search | LIKE query |
| Author | Dropdown Select | Foreign Key filter |
| Genre | Dropdown Select | Array contains filter |

Implementation:

```javascript
const handleFilterChange = (newFilters) => {
  const params = new URLSearchParams();
  params.set('page', 1);
  
  if (newFilters.title) params.set('title', newFilters.title);
  if (newFilters.authorId) params.set('authorId', newFilters.authorId);
  if (newFilters.genre) params.set('genre', newFilters.genre);
  
  navigate(`/books?${params.toString()}`);
  dispatch(actionsBooks.books.fetchBooks({...newFilters, page: 1}));
};
```

Features:

- Real-time filter application
- Backend filtering (not client-side)
- Filter button with collapsible panel
- Clear all filters option

---

#### 2.6 Pagination

Controls:

- Previous/Next buttons
- Page number selector
- Current page indicator
- Items per page dropdown

Example URL: `/books?page=2&title=React&authorId=5`

---

#### 2.7 Filter and Pagination Persistence

Problem: User applies filters, navigates to detail page, clicks back. Should return to same filters and pagination.

Solution:

```javascript
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get('page')) || 1;
  const filters = {
    title: params.get('title') || '',
    authorId: params.get('authorId') || '',
    genre: params.get('genre') || '',
  };
  
  dispatch(actionsBooks.books.fetchBooks({...filters, page: currentPage}));
}, [location.search, dispatch]);

const navigateToDetail = (bookId) => {
  navigate(`/books/${bookId}`, {
    state: {
      returnPage: currentPage,
      returnFilters: currentFilters,
    },
  });
};

const handleBack = () => {
  const returnPage = location.state?.returnPage || 1;
  const returnFilters = location.state?.returnFilters || {};
  
  const params = new URLSearchParams();
  params.set('page', returnPage);
  Object.entries(returnFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  
  navigate(`/books?${params.toString()}`);
};
```

State Persistence: URL parameters + location state

---

### 3. Page 2: Book Detail (Entity Detail)

**URL:** `/books/:id` or `/books/new`

#### 3.1 Two Display Modes: View and Edit

**View Mode (Default for existing books):**

- All book fields displayed in read-only format
- Edit button (pencil icon) in top-right corner
- Clean, organized layout

**Edit Mode (For new/existing books):**

- All fields become editable form inputs
- Save and Cancel buttons replace edit button
- Form validation active

---

#### 3.2 Mode Switching and Save Flow

Edit button flow:

- Located in top-right corner
- Click - Switch to edit mode
- Show Save and Cancel buttons

Save flow:

```
User clicks Save
  |
  v
Validate form
  |
  +-- If errors -> Display error messages, stay in edit mode
  |
  +-- If valid -> Send API request
        |
        +-- Success -> Show success notification
                    -> Switch to view mode
                    -> Display updated values
                    -> Redirect to /books if new
        |
        +-- Error -> Show error notification
                  -> Stay in edit mode
                  -> Preserve form data
```

Implementation:

```javascript
const handleSave = () => {
  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }
  
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
      if (isNew) navigate('/books');
    })
    .catch((err) => {
      dispatch(showNotification({
        message: err.response?.data?.message || t('messages.saveFailed'),
        severity: 'error',
      }));
    });
};
```

---

#### 3.3 Form Validation

**Validation timing:** On Save button click

**Validation rules:**

| Field | Rules | Error Message |
|-------|-------|---------------|
| Title | Required, non-empty | Title is required |
| Author | Required selection | Author is required |
| Year | 1-2025 range | Year must be between 1 and 2025 |
| Genres | Optional | |

Implementation:

```javascript
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
```

**UI behavior:**

- Invalid fields highlighted (red border/background)
- Error messages displayed below fields
- Backend request not sent if validation fails
- Request sent only after all validations pass

---

#### 3.4 Cancel Functionality

**In Edit Mode:**

- For existing book: Return to view mode, restore previous values, discard all edits
- For new book: Navigate back to /books list

Implementation:

```javascript
const handleCancelEdit = () => {
  if (isNew) {
    navigate(-1);
  } else {
    setIsEditMode(false);
    setFormData(currentBook);
    setValidationErrors({});
  }
};
```

---

#### 3.5 Create New Entity Mode

**URL:** `/books/new`

**Automatic behavior:**

- Page opens in edit mode immediately
- All fields empty
- Button labeled "Create" (not "Save")
- Button labeled "Cancel"

Example:

```javascript
const isNew = id === 'new';

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
}, [id, isNew, dispatch]);
```

**On Success:**

- Redirect to `/books` list
- Show "Book created successfully" notification
- New book appears in list

---

#### 3.6 Back Button

**Location:** Top-left or convenient header location

**Functionality:**

- Navigate to /books
- Restore previous filter values
- Restore current page
- Restore pagination state

Implementation:

```javascript
const handleBack = () => {
  const returnPage = location.state?.returnPage || 1;
  const returnFilters = location.state?.returnFilters || {};
  
  const params = new URLSearchParams();
  params.set('page', returnPage);
  if (returnFilters.title) params.set('title', returnFilters.title);
  if (returnFilters.authorId) params.set('authorId', returnFilters.authorId);
  if (returnFilters.genre) params.set('genre', returnFilters.genre);
  
  navigate(`/books?${params.toString()}`);
};
```

---

## Internationalization (i18n)

### Implementation Overview

Complete i18n support for English and Ukrainian using custom hook and translation files.

### File Structure

```
src/intl/
├── index.js                 # Main configuration & getTranslation()
├── messages.js              # mixMessages utility function
├── messages.json            # English translations (default)
└── messages.ua.json         # Ukrainian translations
```

### Translation Keys Reference

```json
{
  "books.list.title": "Books List",
  "books.list.add": "Add Book",
  "books.list.edit": "Edit",
  "books.list.delete": "Delete",
  "books.list.empty": "No books found",
  
  "books.form.title": "Title",
  "books.form.author": "Author",
  "books.form.year": "Year Published",
  "books.form.genres": "Genres",
  
  "books.detail.title": "Book Details",
  "books.detail.save": "Save",
  "books.detail.create": "Create",
  "books.detail.cancel": "Cancel",
  "books.detail.back": "Back",
  
  "messages.created": "Book created successfully",
  "messages.updated": "Book updated successfully",
  "messages.deleted": "Book deleted successfully",
  "messages.error": "An error occurred",
  "messages.saveFailed": "Save failed",
  "messages.deleteFailed": "Delete failed",
  "messages.confirm_delete": "Are you sure you want to delete this book?"
}
```

### Using the useI18n Hook

```javascript
import { useI18n } from '../../misc/hooks/useI18n';

function BooksList() {
  const { t, lang, changeLang } = useI18n();
  
  return (
    <div>
      <h1>{t('books.list.title')}</h1>
      
      <select value={lang} onChange={(e) => changeLang(e.target.value)}>
        <option value="en">English</option>
        <option value="ua">Українська</option>
      </select>
    </div>
  );
}
```

### How mixMessages Works

The mixMessages function merges translations:

```javascript
mixMessages({
  defaultMessages: {
    'books.title': 'Books List',
    'books.new': 'New Book'
  },
  messages: {
    'books.title': 'Список Книг'
  }
})

// Result:
{
  'books.title': 'Список Книг',
  'books.new': 'New Book'
}
```

**Key features:**

- Falls back to English if translation missing
- Supports partial translations
- Type-safe with defined keys
- Persists language preference to localStorage

---

## Component Architecture

### Container vs Presentation Pattern

**Container Component (BookDetail/index.jsx):**

- Manage component state
- Handle side effects and API calls
- Redux dispatch and selectors
- Business logic and handlers
- Pass data and callbacks to presentation component

**Benefits:**

- Separation of concerns
- Reusable presentation component
- Easier testing

**Presentation Component (BookDetailView.jsx):**

- Receive all data via props
- Render UI based on props
- Call callbacks on user interaction
- No API or Redux dependency
- Pure UI rendering

---

## State Management

### Redux Store Structure

```javascript
{
  books: {
    books: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 50,
    },
    filters: {
      title: '',
      authorId: null,
      genre: '',
    },
    currentBook: null,
    authors: [],
    isLoadingList: false,
    isLoadingDetail: false,
    isLoadingAuthors: false,
    isSaving: false,
    error: null,
  },
  notifications: {
    notifications: []
  }
}
```

### Actions Example

```javascript
export const fetchBooks = (filters, page) => (dispatch) => {
  dispatch({ type: FETCH_BOOKS_START });
  return bookService.getBooks({ ...filters, page })
    .then(response => {
      dispatch({
        type: FETCH_BOOKS_SUCCESS,
        payload: response.data,
      });
    })
    .catch(error => {
      dispatch({
        type: FETCH_BOOKS_ERROR,
        payload: error.message,
      });
    });
};

export const showNotification = (notification) => ({
  type: SHOW_NOTIFICATION,
  payload: notification,
});
```

---

## Error Handling

### Error Scenarios

| Scenario | UI Behavior | User Experience |
|----------|------------|-----------------|
| Validation Error | Fields highlighted red | Stay in edit mode, show error message |
| API Error | Error notification | Retry option available |
| Network Error | Notification | Show retry button |
| Delete Error | Dialog remains open | Can retry or cancel |
| Save Error | Notification and Edit mode | Form data preserved |

### Implementation

```javascript
.catch((error) => {
  console.error('Save failed:', error);
  
  const errorMessage = error.response?.data?.message 
    || error.message 
    || t('messages.error');
  
  dispatch(showNotification({
    message: errorMessage,
    severity: 'error',
  }));
  
  setIsEditMode(true);
});
```

---

## User Experience Features

### Notifications System

**Success Notifications:**

- Auto-hide after 4 seconds
- Green styling
- Non-blocking position

**Error Notifications:**

- Stay until user dismisses
- Red styling
- Clear action items

Implementation:

```javascript
dispatch(showNotification({
  message: 'Book saved successfully',
  severity: 'success',
  autoHideMs: 5000,
}));

dispatch(showNotification({
  message: 'Failed to save book',
  severity: 'error',
}));
```

### Loading States

- Loading spinner during data fetch
- Disabled buttons during API calls
- Loading text in list view
- Skeleton loaders (optional)

### Responsive Design

- Mobile-friendly layout
- Touch-friendly button sizes
- Flexible grid layout
- Accessible form inputs

---

## Data Persistence Strategy

### How Filters Survive Page Reload

```
User: /books (no filters)
  |
  v
Apply filter: title = "React"
  |
  v
URL changes to: /books?page=1&title=React
  |
  v
User refreshes page (F5)
  |
  v
Extract params from URL
  |
  v
Fetch data with saved params
  |
  v
Display filtered results
```

### Implementation Steps

**1. Update URL on filter change:**

```javascript
const handleFilterChange = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  navigate(`/books?${params.toString()}`);
};
```

**2. Extract params on mount:**

```javascript
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const filters = {
    title: params.get('title') || '',
    authorId: params.get('authorId') || '',
  };
  dispatch(fetchBooks(filters));
}, [location.search]);
```

**3. Preserve state when navigating:**

```javascript
navigate(`/books/${id}`, {
  state: {
    returnPage: currentPage,
    returnFilters: currentFilters,
  },
});
```

---

## Setup & Installation

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation Steps

```bash
git clone <repository-url>
cd <project-directory>

npm install

npm install react-router-dom redux react-redux axios

npm start
```

### Environment Configuration

```bash
REACT_APP_API_URL=http://localhost:8080/api
```

### Running the Application

```bash
npm start

npm run build

npm test
```

### Access Application

- Default: http://localhost:3050
- With English: http://localhost:3050?lang=en
- With Ukrainian: http://localhost:3050?lang=ua

---

## Testing Checklist

### Books List Page

- [ ] Page loads with paginated book data
- [ ] Filter by title works correctly
- [ ] Filter by author works correctly
- [ ] Filter by genre works correctly
- [ ] Pagination controls work
- [ ] Filters and pagination persist on page reload
- [ ] Add book button navigates to detail page
- [ ] Clicking book row navigates to detail page
- [ ] Delete button appears on hover
- [ ] Delete confirmation dialog opens
- [ ] Confirming delete removes item from list
- [ ] Delete success notification shows
- [ ] Delete error keeps dialog open
- [ ] Language selector changes all text

### Book Detail Page

- [ ] New book page opens in edit mode
- [ ] Existing book page opens in view mode
- [ ] Edit button switches to edit mode
- [ ] Form validation works for all fields
- [ ] Invalid fields highlighted in red
- [ ] Save button submits valid form
- [ ] Save shows success notification
- [ ] Save switches back to view mode
- [ ] Save updates displayed values
- [ ] Cancel restores previous values
- [ ] Cancel redirects to list for new book
- [ ] Back button returns to list
- [ ] Back button preserves filters
- [ ] Back button preserves pagination
- [ ] All text uses translations

### Internationalization

- [ ] Language selector works
- [ ] All UI text translates
- [ ] Language persists on reload
- [ ] Notifications translate
- [ ] Validation messages translate
- [ ] Filter labels translate
- [ ] Button labels translate

### General

- [ ] No console errors
- [ ] No console warnings
- [ ] API calls complete successfully
- [ ] Error messages display correctly
- [ ] Loading states show appropriately
- [ ] Responsive on mobile/tablet/desktop

---

## API Endpoints

### Books Endpoints

| Method | Endpoint | Purpose | Params |
|--------|----------|---------|--------|
| GET | /api/books | List books with filters | page, title, authorId, genre |
| GET | /api/books/:id | Get single book | id (path) |
| POST | /api/books | Create book | Request body |
| PUT | /api/books/:id | Update book | id (path), Request body |
| DELETE | /api/books/:id | Delete book | id (path) |

### Authors Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/authors | List all authors |

### Genres Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/genres | List all genres |

### Example Requests

**List with filters:**

```
GET /api/books?page=1&pageSize=10&title=React&authorId=5
```

**Create book:**

```
POST /api/books
{
  "title": "Clean Code",
  "yearPublished": 2008,
  "authorId": 3,
  "genres": ["Programming", "Design"]
}
```

**Update book:**

```
PUT /api/books/7
{
  "title": "Clean Code (Updated)",
  "yearPublished": 2009,
  "authorId": 3,
  "genres": ["Programming"]
}
```

---

## Technologies Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 17+ |
| Redux | State Management | Latest |
| React Router | Client Navigation | v6 |
| Axios | HTTP Client | Latest |
| JavaScript | Language | ES6+ |
| CSS | Styling | Custom |

---

## Support

For issues or questions:

1. Check the Testing Checklist
2. Review Error Handling section
3. Verify API endpoints in API Reference
4. Check browser console for errors

---

