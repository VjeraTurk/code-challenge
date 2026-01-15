/**
 * Soft assertions helper for Jest
 *
 * Collects assertion failures and reports them all at once at the end of the test.
 * This allows you to see all failures in a test, not just the first one.
 *
 * Usage:
 * ```ts
 * it('test with soft assertions', () => {
 *   const soft = createSoftAssertions();
 *
 *   soft.expect(result).toHaveLength(2);
 *   soft.expect(result).toContainEqual({ row: 1, column: 0 });
 *   soft.expect(result).toContainEqual({ row: 1, column: 2 });
 *
 *   soft.assertAll(); // Throws if any assertions failed
 * });
 * ```
 */

import { expect as jestExpect } from "@jest/globals";

type JestMatchers<R> = jest.Matchers<R>;

interface SoftExpect {
  <T = any>(actual: T): JestMatchers<T>;
}

interface SoftAssertions {
  expect: SoftExpect;
  assertAll: () => void;
}

export function createSoftAssertions(): SoftAssertions {
  const failures: Array<{ message: string; error: Error }> = [];

  const softExpect = <T = any>(actual: T): JestMatchers<T> => {
    // Create a wrapper that intercepts matcher calls
    const createMatcherProxy = (target: any): any => {
      return new Proxy(target, {
        get(_, prop) {
          const originalValue = target[prop];

          if (typeof originalValue === 'function') {
            return function(...args: any[]) {
              try {
                const result = originalValue.apply(target, args);
                // If it's a promise (async matcher), catch errors
                if (result && typeof result.then === 'function') {
                  return result.catch((error: Error) => {
                    failures.push({
                      message: `expect(...).${String(prop)}(${args.map(a => JSON.stringify(a)).join(', ')})`,
                      error,
                    });
                  });
                }
                return result;
              } catch (error) {
                failures.push({
                  message: `expect(...).${String(prop)}(${args.map(a => JSON.stringify(a)).join(', ')})`,
                  error: error as Error,
                });
                // Return a pass-through object to allow chaining
                return createMatcherProxy({
                  not: createMatcherProxy({}),
                  resolves: createMatcherProxy({}),
                  rejects: createMatcherProxy({}),
                });
              }
            };
          }

          // Handle special properties like 'not'
          if (prop === 'not') {
            return createMatcherProxy({
              ...Object.keys(jestExpect(actual).not).reduce((acc, key) => {
                acc[key] = function(...args: any[]) {
                  try {
                    const result = jestExpect(actual).not[key](...args);
                    if (result && typeof result.then === 'function') {
                      return result.catch((error: Error) => {
                        failures.push({
                          message: `expect(...).not.${String(key)}(${args.map(a => JSON.stringify(a)).join(', ')})`,
                          error,
                        });
                      });
                    }
                    return result;
                  } catch (error) {
                    failures.push({
                      message: `expect(...).not.${String(key)}(${args.map(a => JSON.stringify(a)).join(', ')})`,
                      error: error as Error,
                    });
                    return createMatcherProxy({});
                  }
                };
                return acc;
              }, {} as any),
            });
          }

          return originalValue;
        },
      });
    };

    const jestMatchers = jestExpect(actual);
    return createMatcherProxy(jestMatchers) as JestMatchers<T>;
  };

  const assertAll = () => {
    if (failures.length > 0) {
      const messages = failures.map((f, i) => `  ${i + 1}. ${f.message}\n     ${f.error.message}`).join('\n');
      throw new Error(`Soft assertion failures (${failures.length}):\n${messages}`);
    }
  };

  return {
    expect: softExpect,
    assertAll,
  };
}
