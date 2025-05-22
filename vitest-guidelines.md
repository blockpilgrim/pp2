# Vitest Testing Framework: Guidelines and Best Practices

## 1. Overview

This document provides guidelines and best practices for using the Vitest testing framework in the `partner-portal-v2` project. Its purpose is to ensure that our testing strategies are consistent, effective, and align with our core engineering principles. All team members, including AI agents, should reference this guide when writing, maintaining, or expanding our tests.

Our goal is to build a robust testing suite that enhances:
* **Security**: Ensuring new changes don't introduce vulnerabilities.
* **Stability**: Catching regressions and bugs early.
* **Scalability**: Allowing our codebase and team to grow efficiently.
* **Maintainability**: Keeping tests easy to understand, update, and run.
* **Knowledge Sharing**: Making code and its expected behavior clear to everyone.
* **Clarity & Simplicity**: Writing tests that are straightforward and easy to follow.
* **Modern Best Practices**: Leveraging effective patterns and tools.

## 2. Current Vitest Setup

Our project utilizes Vitest, a modern and fast testing framework built on top of Vite.

### 2.1. Configuration (`vitest.config.ts`)

The primary configuration for Vitest is located in `vitest.config.ts`. Key settings include:

* **Plugins**: Includes `@vitejs/plugin-react` for React component testing.
* **Test Environment**: Set to `jsdom` to simulate a browser environment, necessary for testing DOM interactions and React components.
* **Globals**: `globals: true` allows Vitest's testing APIs (`describe`, `it`, `expect`, etc.) to be available globally without explicit imports in test files.
* **Setup Files**: `setupFiles: []` is a placeholder for future global setup scripts (e.g., for polyfills, global mocks, or extending `expect`). This might be `./vitest.setup.ts` in the future.
* **Test File Discovery**: Tests are matched using the patterns `['**/*.test.tsx?', '**/*.spec.tsx?']`.
* **Path Alias**: An alias `'@': path.resolve(__dirname, '.')` is configured to simplify imports (e.g., `import { MyComponent } from '@/components/MyComponent';`).
* **Coverage**:
    * Provider: `'v8'`.
    * Reporters: `['text', 'json', 'html']` for console output, JSON files, and an HTML report.

### 2.2. NPM Scripts (`package.json`)

The following npm scripts are available for running tests:

* `npm run test`: Runs all tests once.
* `npm run test:ui`: Starts Vitest with its interactive UI for a better debugging experience.
* `npm run test:watch`: Runs tests in watch mode, re-running them on file changes.

### 2.3. TypeScript Integration (`tsconfig.json`)

Our `tsconfig.json` is configured to support Vitest:

* **Types**: Includes `"vitest/globals"` in the `compilerOptions.types` array to provide TypeScript with type definitions for Vitest's global variables.
* **Paths**: The `compilerOptions.paths` are configured with `{"@/*": ["./*"]}` to match the alias used in `vitest.config.ts`.

## 3. Writing Unit Tests

Unit tests should focus on testing the smallest "units" of code in isolation (e.g., individual functions, components, or methods).

### 3.1. File Naming and Location

* **Naming**: Test files should be named using the format `[filename].test.ts` or `[filename].spec.ts` (or `.tsx` for components). Example: `example-utils.test.ts` for `example-utils.ts`.
* **Location**:
    * For utility functions or services (e.g., in the `lib` directory), place test files alongside the source file.
    * For components, place the test file in the same directory as the component or in a dedicated `__tests__` subdirectory within the component's folder.

### 3.2. Structuring Tests

Use `describe` blocks to group related tests and `it` (or `test`) blocks for individual test cases. Aim for descriptive names for both.

```typescript
// Example structure from lib/utils/example-utils.test.ts
import { describe, it, expect } from 'vitest';
import { add, concatenateStrings } from '@/lib/utils/example-utils'; // Using path alias

describe('example-utils', () => {
  describe('add function', () => {
    it('should return the sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(5, -2)).toBe(3);
    });
    // ... more test cases
  });

  describe('concatenateStrings function', () => {
    it('should concatenate two non-empty strings', () => {
      expect(concatenateStrings('hello', ' world')).toBe('hello world');
    });
    // ... more test cases
  });
});
```

### 3.3. Assertions

Use Vitest's `expect` API with its various matchers to make assertions about your code's behavior. Common matchers include:
* `toBe()`: For strict equality (uses `Object.is`).
* `toEqual()`: For deep equality of objects and arrays.
* `toBeTruthy()`, `toBeFalsy()`: For truthiness/falsiness.
* `toContain()`: For checking if an array or string contains a value.
* `toThrow()`: For asserting that a function throws an error.
* ...and many more. Refer to the [Vitest documentation](https://vitest.dev/api/expect.html) for a full list.

### 3.4. Path Aliases

Utilize the configured `'@/'` path alias for cleaner and more maintainable import statements within your tests, as seen in `example-utils.test.ts`.

```typescript
import { add } from '@/lib/utils/example-utils'; // Correct
// instead of: import { add } from '../../../lib/utils/example-utils'; // Avoid
```

## 4. Running Tests

Use the NPM scripts defined in `package.json`:

* **For a single run (e.g., in CI/CD pipelines):**
    ```bash
    npm run test
    ```
* **For interactive development with a UI:**
    ```bash
    npm run test:ui
    ```
* **To run tests in watch mode during development:**
    ```bash
    npm run test:watch
    ```

## 5. Test Coverage

Test coverage helps identify parts of your codebase that are not covered by tests.

* **Generating Reports**: Coverage reports are automatically generated when running `npm run test`. You can find them in the `coverage/` directory. The `html` reporter provides an interactive way to explore coverage.
* **Interpreting Reports**: Aim for high coverage, but focus on testing critical paths and complex logic. 100% coverage doesn't always mean bug-free code, but it's a good indicator of thoroughness.

## 6. Best Practices & Advice

### 6.1. Clarity and Simplicity
* Write tests that are easy to read and understand. Each test should ideally verify one specific piece of behavior.
* Use descriptive names for `describe` and `it` blocks.

### 6.2. Maintainability
* **Setup Files**: As the project grows, utilize `vitest.setup.ts` (or a similar file added to `setupFiles` in `vitest.config.ts`) for global test configurations, mocks, or helper functions (e.g., custom render functions for React components).
* **Test Organization**: Keep tests close to the code they are testing.
* **Avoid Flaky Tests**: Ensure tests are deterministic and don't rely on external factors that can change. Properly mock dependencies and manage state.
* **AAA Pattern (Arrange, Act, Assert)**:
    * **Arrange**: Set up the necessary preconditions and inputs.
    * **Act**: Execute the code being tested.
    * **Assert**: Verify the outcome is as expected.

### 6.3. Testing Different Types of Code
* **Pure Functions**: These are the easiest to test. Provide inputs and assert the outputs (as seen in `example-utils.test.ts`).
* **React Components**:
    * Use `@testing-library/react` (implicitly via Vitest's React plugin and `jsdom` environment) for testing component rendering, user interactions, and accessibility.
    * Focus on testing what the user sees and interacts with, not implementation details.
    * Test component props, state changes, and event handling.
* **Async Code**: Use `async/await` with Vitest's promise handling capabilities (e.g., `expect(promise).resolves.toBe(...)` or `expect(promise).rejects.toThrow(...)`).
* **Hooks**: Test custom React hooks by using them within a test component or using `@testing-library/react-hooks` if necessary.

### 6.4. Mocking
* Vitest provides built-in mocking capabilities (`vi.fn()`, `vi.spyOn()`, `vi.mock()`).
* Mock external dependencies (API calls, services, browser APIs not in `jsdom`) to isolate the unit under test and make tests faster and more reliable.
* Example: To mock a module:
    ```typescript
    // In your test file
    import { someService } from '@/services/someService';
    vi.mock('@/services/someService'); // Mock the entire module

    it('should use the mocked service', () => {
      const mockGetData = vi.fn().mockResolvedValue('mocked data');
      (someService as vi.Mocked<typeof someService>).getData = mockGetData;

      // ... test logic that uses someService.getData()
      expect(mockGetData).toHaveBeenCalled();
    });
    ```

### 6.5. Security, Stability, and Scalability for Tests
* **Security**: Avoid hardcoding sensitive data in tests. Use mock data or environment variables for test configurations if absolutely necessary (though ideally, unit tests shouldn't rely on external credentials).
* **Stability**: Write tests that are resilient to minor, unrelated code changes. Focus on public APIs and behavior rather than internal implementation. Ensure proper cleanup after each test (e.g., `afterEach(() => vi.clearAllMocks());`).
* **Scalability**: As the number of tests grows, ensure they run efficiently. Vitest is designed for speed. Well-structured, focused tests contribute to scalability.

### 6.6. Keep Tests Up-to-Date
* Treat tests as first-class citizens. When code changes, update the corresponding tests.
* Write tests for new features and bug fixes.

## 7. Future Enhancements

As our application and testing needs evolve, we will consider expanding our strategies to include:

* **Integration Tests**: Testing interactions between multiple units/modules.
* **End-to-End (E2E) Tests**: Testing complete user flows through the application (e.g., using tools like Playwright or Cypress).
* **Visual Regression Tests**: For UI components to catch unintended visual changes.
* **Performance Tests**: To ensure critical paths meet performance benchmarks.

By adhering to these guidelines, we can build a high-quality, reliable, and maintainable application.