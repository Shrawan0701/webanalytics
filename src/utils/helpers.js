import moment from 'moment';
import { CHART_COLORS, DATE_RANGES, VALIDATION } from './constants';

/**
 * Format numbers for display
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';

  const number = parseInt(num, 10);

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }

  return number.toLocaleString();
};

/**
 * Format dates for display
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Generate chart data for analytics
 */
export const generateChartData = (data, dateRange = 30) => {
  if (!data || !Array.isArray(data)) return [];

  const endDate = moment();
  const startDate = moment().subtract(dateRange, 'days');
  const chartData = [];

  // Create array of all dates in range
  for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'day')) {
    const dateStr = date.format('YYYY-MM-DD');
    const dataPoint = data.find(d => moment(d.date).format('YYYY-MM-DD') === dateStr);

    chartData.push({
      date: date.format('MMM DD'),
      fullDate: dateStr,
      count: dataPoint ? parseInt(dataPoint.count, 10) : 0
    });
  }

  return chartData;
};

/**
 * Get color for chart by index
 */
export const getChartColor = (index) => {
  const colors = Object.values(CHART_COLORS);
  return colors[index % colors.length];
};

/**
 * Validate form inputs
 */
export const validateInput = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < VALIDATION.USERNAME.MIN_LENGTH) {
      return `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`;
    }
    if (value.length > VALIDATION.USERNAME.MAX_LENGTH) {
      return `Username must not exceed ${VALIDATION.USERNAME.MAX_LENGTH} characters`;
    }
    if (!VALIDATION.USERNAME.PATTERN.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    if (value.length > VALIDATION.EMAIL.MAX_LENGTH) {
      return `Email must not exceed ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
    }
    if (!VALIDATION.EMAIL.PATTERN.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      return `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    }
    if (value.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      return `Password must not exceed ${VALIDATION.PASSWORD.MAX_LENGTH} characters`;
    }
    return null;
  },

  websiteName: (value) => {
    if (!value) return 'Website name is required';
    if (value.length > VALIDATION.WEBSITE.NAME_MAX_LENGTH) {
      return `Website name must not exceed ${VALIDATION.WEBSITE.NAME_MAX_LENGTH} characters`;
    }
    return null;
  },

  websiteDomain: (value) => {
    if (!value) return 'Domain is required';
    if (!VALIDATION.WEBSITE.DOMAIN_PATTERN.test(value)) {
      return 'Domain must start with http:// or https://';
    }
    return null;
  }
};

/**
 * Generate tracking code snippet
 */
export const generateTrackingCode = (websiteId, apiUrl = 'http://localhost:8080/api') => {
  return `<!-- Analytics Tracking Code -->
<script src="${apiUrl}/tracking.js"></script>
<script>
  AnalyticsTracker.init('${websiteId}', {
    debug: false
  });
</script>`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get date range options for filters
 */
export const getDateRangeOptions = () => {
  return Object.entries(DATE_RANGES).map(([key, value]) => ({
    value: value.days,
    label: value.label
  }));
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Safely get nested object property
 */
export const getNestedProperty = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => current[key], obj) || defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};
