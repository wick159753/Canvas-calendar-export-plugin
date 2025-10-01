# Testing Guide for Canvas Calendar Exporter

This document outlines the testing strategy for the Canvas Calendar Exporter application. We use the [Jest](https://jestjs.io/) framework along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to ensure the application is robust and reliable.

## 1. Setup

To run the tests, you first need to install the development dependencies defined in `package.json`.

```bash
# Install all required testing libraries
npm install
```

## 2. Running Tests

Once the dependencies are installed, you can run the entire test suite with a single command:

```bash
npm test
```

This command will find all files ending in `.test.ts` or `.test.tsx` and execute them.

## 3. Testing Strategy

Our testing strategy is divided into three layers to cover different aspects of the application:

### a. Unit Tests
- **Goal**: To test individual functions or small pieces of logic in isolation.
- **Example**: `services/calendarService.test.ts`
- **Description**: This file tests the helper functions in `calendarService.ts`. We check if `generateGoogleCalendarUrl` creates a correctly formatted URL and if `generateAndDownloadIcsFile` attempts to create a file with the right content, without actually downloading it (by mocking browser APIs).

### b. Component Tests
- **Goal**: To test individual React components to ensure they render correctly and respond to user interaction as expected.
- **Example**: `components/CalendarEvent.test.tsx`
- **Description**: This file tests the `CalendarEventComponent`. We render the component with mock data and simulate user actions, such as clicking the "Add to Google" and "Save .ics" buttons. We then verify that the correct functions are called in response to these clicks.

### c. Integration Tests
- **Goal**: To test how multiple components work together as a single unit.
- **Example**: `App.test.tsx`
- **Description**: This file tests the main `App` component. It verifies the entire user flow:
  1.  It checks that a loading spinner is displayed initially.
  2.  It uses a mocked version of `canvasService` to simulate an API call.
  3.  It waits for the data to "load" and then asserts that the calendar events are correctly grouped by date and rendered on the screen.
  4.  It also tests the error state by making the mock service throw an error and confirming that an error message is shown to the user.

## 4. Mocking

### Service Mocking
In our tests, we don't want to make real network requests. We use `jest.mock()` to replace the actual `canvasService` with a fake version. This gives us full control over the data returned during a test, allowing us to simulate success, loading, and error states reliably.

### Browser API Mocking
Functions that interact with browser APIs (like `window.open` or `URL.createObjectURL`) are also mocked. This allows us to verify that our code *attempts* to call these APIs with the correct arguments, without having a real browser window open. This makes our tests fast and predictable.
