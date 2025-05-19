// Error reporting utility for Webmark
// This can be expanded to send errors to a backend service or analytics

/**
 * Formats an error object for logging and reporting
 * @param {Error} error - The error object
 * @param {Object} additionalInfo - Any additional context information
 * @returns {Object} Formatted error object
 */
export const formatError = (error, additionalInfo = {}) => {
  // Extract useful information from the error
  const formattedError = {
    message: error.message || 'Unknown error',
    name: error.name,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalInfo
  };

  // Filter out sensitive information
  if (formattedError.stack) {
    formattedError.stack = formattedError.stack.replace(
      /\b(?:password|token|key|secret|auth)\b[:=]["'][^"']+["']/gi,
      match => match.replace(/[:=]["'][^"']+["']/, match => ':"[REDACTED]"')
    );
  }

  return formattedError;
};

/**
 * Reports an error to console and optionally to a backend service
 * @param {Error} error - The error object
 * @param {Object} additionalInfo - Any additional context information
 */
export const reportError = (error, additionalInfo = {}) => {
  const formattedError = formatError(error, additionalInfo);

  // Log to console in development
  console.error('Webmark Error:', formattedError);

  // In production, you could send this to a backend API
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to a backend endpoint
    // fetch('/api/error-reporting', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formattedError)
    // }).catch(err => console.error('Failed to report error:', err));

    // Or use a service like Sentry
    // Sentry.captureException(error, { extra: additionalInfo });
  }

  return formattedError;
};

/**
 * Wraps async functions with error handling
 * @param {Function} fn - The async function to wrap
 * @param {Object} additionalInfo - Any additional context information
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (fn, additionalInfo = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      reportError(error, {
        functionName: fn.name || 'anonymous function',
        arguments: JSON.stringify(args.map(arg =>
          typeof arg === 'object' ? '[Object]' : arg
        )),
        ...additionalInfo
      });
      throw error; // Re-throw so it can be handled by React Error Boundary
    }
  };
};
