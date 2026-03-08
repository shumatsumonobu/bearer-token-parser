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
declare const _default: (fn: Function) => boolean;
export default _default;
