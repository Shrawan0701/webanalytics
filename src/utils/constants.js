// Application constants
export const APP_NAME = 'Analytics Dashboard';
export const APP_VERSION = '1.0.0';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/signin',
    REGISTER: '/auth/signup',
    VALIDATE: '/auth/validate'
  },
  WEBSITES: {
    LIST: '/websites',
    CREATE: '/websites',
    GET: (id) => `/websites/${id}`,
    UPDATE: (id) => `/websites/${id}`,
    DELETE: (id) => `/websites/${id}`,
    STATS: (id) => `/websites/${id}/stats`
  },
  ANALYTICS: {
    OVERVIEW: (id) => `/analytics/${id}/overview`,
    EVENTS: (id) => `/analytics/${id}/events`,
    CHART_DATA: (id) => `/analytics/${id}/chart-data`,
    TOP_PAGES: (id) => `/analytics/${id}/top-pages`,
    SUMMARY: (id) => `/analytics/${id}/summary`
  },
  TRACKING: {
    EVENT: '/track/event',
    BATCH: '/track/batch',
    PING: '/track/ping',
    SCRIPT: '/tracking.js'
  }
};

// Date ranges for analytics
export const DATE_RANGES = {
  LAST_7_DAYS: { days: 7, label: 'Last 7 days' },
  LAST_30_DAYS: { days: 30, label: 'Last 30 days' },
  LAST_90_DAYS: { days: 90, label: 'Last 90 days' }
};

// Event types
export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  CUSTOM: 'custom'
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#667eea',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  SECONDARY: '#6b7280'
};

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Validation rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 40
  },
  EMAIL: {
    MAX_LENGTH: 50,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  WEBSITE: {
    NAME_MAX_LENGTH: 255,
    DOMAIN_PATTERN: /^https?:\/\/.+/
  }
};

// Default messages
export const MESSAGES = {
  LOADING: 'Loading...',
  NO_DATA: 'No data available',
  ERROR: 'An error occurred',
  SUCCESS: 'Operation completed successfully',
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?'
};

// Feature flags
export const FEATURES = {
  DARK_MODE: false,
  REAL_TIME_UPDATES: true,
  EXPORT_DATA: true,
  ADVANCED_ANALYTICS: true
};
