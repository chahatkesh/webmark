# Webmark Error Handling System

This document explains the error handling architecture implemented in the Webmark application.

## Overview

The Webmark error handling system provides comprehensive error detection, reporting, and recovery mechanisms. It includes:

1. **Client-side Error Boundaries**: React error boundaries catch rendering errors
2. **Global Error Handlers**: Catch unhandled errors and promise rejections
3. **Network Error Handling**: Monitor and report API failures
4. **Error Reporting**: Centralized error reporting with context information
5. **User Error Reporting**: Interface for users to report issues
6. **Fallback Error Pages**: Graceful handling of routing errors

## Key Components

### Error Handling Files

- `/src/utils/errorReporter.js` - Core error reporting utilities
- `/src/utils/errorHandling.js` - Global error handlers configuration
- `/src/components/enhanced/ErrorComponents.jsx` - React error boundaries and fallback UI
- `/src/pages/ErrorPage.jsx` - Router error page
- `/src/pages/NotFoundPage.jsx` - 404 error page
- `/src/pages/ReportProblem.jsx` - User error reporting interface

### Error Reporting Flow

1. Error occurs in application
2. Error is caught by appropriate handler:
   - React component errors → Error Boundary
   - Routing errors → React Router error element
   - API errors → fetch interceptor
   - Unhandled errors → Global window event listeners
3. Error is formatted and logged via `reportError()`
4. User is shown appropriate error UI
5. Application attempts to recover when possible

## Usage Guide

### React Component Error Handling

Wrap components that might error in an ErrorBoundary:

```jsx
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Manual Error Reporting

Report errors manually when needed:

```jsx
import { reportError } from "../utils/errorReporter";

try {
  // risky code
} catch (error) {
  reportError(error, {
    context: "additional information",
    component: "ComponentName",
  });
  // show error UI
}
```

### Extending the System

To add new error types or reporting destinations:

1. Modify `errorReporter.js` to handle new error types or add reporting endpoints
2. Create custom ErrorBoundary components for specific parts of the application
3. Add additional context to caught errors

## Future Enhancements

- Server-side error logging integration
- Error analytics dashboard
- Automatic retry mechanisms
- More granular error categorization
