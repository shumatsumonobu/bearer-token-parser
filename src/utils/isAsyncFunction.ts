/**
 * The constructor of `AsyncFunction`, used for type comparison.
 * @type {Function}
 */
const AsyncFunctionConstructor = Object.getPrototypeOf(async function(){}).constructor;

/**
 * Determines whether a given function is an async function.
 *
 * @param {Function} fn - The function to check.
 * @returns {boolean} `true` if the function is an async function, `false` otherwise.
 * @example
 * ```typescript
 * isAsyncFunction(async () => {});  // true
 * isAsyncFunction(() => {});        // false
 * isAsyncFunction(function() {});   // false
 * ```
 */
export default (fn: Function): boolean => {
  return fn != null && fn.constructor === AsyncFunctionConstructor;
}
