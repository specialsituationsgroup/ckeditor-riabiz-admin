// Application Constants

// URLs
export const FRONTEND_SIGNIN_URL = "/auth/signin";
export const ADMIN_BASE_URL = "/admin";

// Placeholders
export const PLACEHOLDER_AVATAR = "/images/placeholder-avatar.png";
export const PLACEHOLDER_IMAGE = "/images/placeholder-image.png";

// Editor Configuration
export const EDITOR_CONFIG = {
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
    ],
    image: {
        toolbar: [
            'imageTextAlternative',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    }
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Article Status
export const ARTICLE_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
    PENDING_REVIEW: 'pending_review'
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    VIEWER: 'viewer'
};

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Toast Messages
export const TOAST_MESSAGES = {
    SAVE_SUCCESS: 'Article saved successfully',
    SAVE_ERROR: 'Failed to save article',
    PUBLISH_SUCCESS: 'Article published successfully',
    PUBLISH_ERROR: 'Failed to publish article',
    DELETE_SUCCESS: 'Article deleted successfully',
    DELETE_ERROR: 'Failed to delete article',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.'
};

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const RELATIVE_TIME_FORMAT = 'relative';

// API Response Codes
export const API_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    DRAFT_ARTICLE: 'draft_article',
    THEME: 'theme'
};

// Theme
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

export default {
    FRONTEND_SIGNIN_URL,
    ADMIN_BASE_URL,
    PLACEHOLDER_AVATAR,
    PLACEHOLDER_IMAGE,
    EDITOR_CONFIG,
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    ARTICLE_STATUS,
    USER_ROLES,
    MAX_FILE_SIZE,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    TOAST_MESSAGES,
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    RELATIVE_TIME_FORMAT,
    API_STATUS,
    STORAGE_KEYS,
    THEMES
};