// Configures global error handling for the Webmark application
import { reportError } from './errorReporter';

/**
 * Sets up global unhandled error listeners
 * Should be called early in the application lifecycle
 */
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason || new Error('Unhandled Promise rejection'), {
      unhandled: true,
      promise: true,
      stack: event.reason?.stack
    });
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    // Only report if it's a true error and not a resource loading error
    if (event.error) {
      reportError(event.error, {
        unhandled: true,
        line: event.lineno,
        column: event.colno,
        source: event.filename
      });
    }

    // Don't report resources loading errors (images, scripts, etc.) as they're usually not actionable
    if (event.target && (event.target.tagName === 'LINK' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'IMG')) {
      return;
    }
  });

  // Override console.error to catch and report errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Call the original console.error
    originalConsoleError.apply(console, args);

    // Report the error if it's an Error object
    if (args[0] instanceof Error) {
      reportError(args[0], {
        source: 'console.error',
        consoleError: true
      });
    }
  };

  // Patch fetch to report API errors
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      // Report failed API calls as errors
      if (!response.ok) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown';
        reportError(new Error(`API Error: ${response.status} ${response.statusText}`), {
          source: 'fetch',
          url,
          status: response.status,
          statusText: response.statusText
        });
      }

      return response;
    } catch (error) {
      // Report network errors
      reportError(error, {
        source: 'fetch',
        request: typeof args[0] === 'string' ? args[0] : 'Request object'
      });
      throw error;
    }
  };
}

/**
 * Detect browser and device information for error reporting
 */
export function getBrowserInfo() {
  const { userAgent } = navigator;

  // Extract browser name and version
  let browser = 'Unknown';
  let browserVersion = '';

  if (/firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/opera|opr/i.test(userAgent)) {
    browser = 'Opera';
  }

  // Determine OS
  let os = 'Unknown';
  if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = 'MacOS';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'iOS';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  }

  // Determine device type
  let device = 'Desktop';
  if (/mobile|android|iphone|ipod|iemobile|blackberry/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    device = 'Tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    device,
    userAgent,
    language: navigator.language || 'Unknown',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  };
}
