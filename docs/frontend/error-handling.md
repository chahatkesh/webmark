# Error Handling

Layered client error handling for render failures, network issues, and unexpected exceptions.

## Layers

| Layer     | Mechanism                                                        | Files                                     |
| --------- | ---------------------------------------------------------------- | ----------------------------------------- |
| Global    | `unhandledrejection`, `error`, patched `fetch` / `console.error` | `utils/errorHandling.js`                  |
| Reporting | `reportError`, `formatError`, `withErrorHandling`                | `utils/errorReporter.js`                  |
| React     | `ErrorBoundary` + fallback UI                                    | `components/enhanced/ErrorComponents.jsx` |
| Router    | `errorElement`                                                   | `pages/ErrorPage.jsx`                     |
| 404       | Catch-all route                                                  | `pages/NotFoundPage.jsx`                  |
| API       | `ApiError` from `apiRequest`                                     | `utils/apiClient.js`                      |
| SWR       | Hook `onError` toasts                                            | Various hooks                             |

`setupGlobalErrorHandlers()` runs from `main.jsx` at boot.

## Error Boundary

```jsx
import { ErrorBoundary } from "../components/enhanced/ErrorComponents";

<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>;
```

## Manual Reporting

```jsx
import { reportError } from "../utils/errorReporter";

try {
  // risky work
} catch (error) {
  reportError(error, {
    context: "optional context",
    component: "ComponentName",
  });
}
```

## API Errors

`apiClient` throws `ApiError` with `status`, `data`, and optional `code`. Auth 401s trigger a single-flight refresh before retry. Expected auth probes (userdata / refresh) are treated carefully by the fetch patch so they do not spam toasts.

Auth redirect error query params (`?error=`) are mapped in `utils/authErrors.js`:

| Code                  | User message theme        |
| --------------------- | ------------------------- |
| `auth_failed`         | Generic auth failure      |
| `oauth_state_invalid` | Expired / invalid sign-in |
| `device_limit`        | Device limit reached      |

## Extending

1. Add destinations or enrichment in `errorReporter.js`
2. Wrap fragile subtrees in dedicated boundaries
3. Prefer structured `code` values from the API for actionable UI
