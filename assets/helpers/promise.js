// @flow

import { logException } from 'helpers/logger';

// Repeats a promise a maximum of `n` times, until it succeeds or bottoms out
function repeatPromise<A>(n: number, p: () => Promise<A>): Promise<A> {
  return n === 0
    ? Promise.reject(new Error(`Failed after ${n} attempts`))
    : p().catch(() => repeatPromise(n - 1, p));
}

// Runs a promise `i` milliseconds in the future
function sleepPromise<A>(i: number, p: () => Promise<A>): Promise<A> {
  return new Promise((resolve, reject) => {
    setTimeout(() => p().then(resolve, reject), i);
  });
}

// Runs a promise `p` every `sleep` milliseconds until the result passes a validation test `pred`
// and fails after `max` attempts
function pollUntilPromise<A>(max: number, sleep: number, p: () => Promise<A>, pred: A => boolean): Promise<A> {
  const innerPromise = () => p().then(a => (pred(a) ? Promise.reject() : a));
  return repeatPromise(max, () => sleepPromise(sleep, innerPromise));
}

// Logs any error produced by the promise
function logPromise<A>(p: Promise<A>): Promise<A> {
  return p.catch((error) => {
    logException(error);
    throw error;
  });
}

// Wraps a promise `use` with pre- and post- processing actions.
function bracketPromise<A, B>(
  acquire: () => Promise<void>,
  release: () => Promise<void>,
  use: A => Promise<B>,
): A => Promise<B> {
  const releaseAndReturn = b => release.then(() => b);
  const releaseAndRethrow = e => release.then(() => Promise.reject(e));
  return a => acquire()
    .then(() => use(a))
    .then(releaseAndReturn, releaseAndRethrow);
}

export {
  repeatPromise,
  sleepPromise,
  pollUntilPromise,
  logPromise,
  bracketPromise,
};
