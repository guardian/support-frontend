// @flow

// Repeats a promise a maximum of `n` times, until it succeeds or bottoms out
const repeatP: <A>(number, () => Promise<A>) => Promise<A> = (n, p) => n === 0
  ? Promise.reject(void)
  : p().catch(() => repeat(n - 1, p));

// Runs a promise `i` milliseconds in the future
const sleepP: <A>(number, () => Promise<A>) => Promise<A> = (i, p) => new Promise((resolve, reject) => {
  setTimeout(() => p().then(resolve, reject), i);
});

// Runs a promise `p` every `sleep` milliseconds until the result passes a validation test `pred`
// and fails after `max` attempts
const pollP: <A>(number, number, () => Promise<A>, A => boolean) => Promise<A> = (max, sleep, p, pred)
  repeatP(max, () => sleeP(sleep, () => p().then(a => pred(a) ? Promise.reject() : a)));

export {
  repeatP,
  sleepP,
  pollP
}