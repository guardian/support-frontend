// @flow

import { logException } from 'helpers/logger';

// Repeats a promise a maximum of `n` times, until it succeeds or bottoms out
function repeatP<A>(n: number, p: () => Promise<A>): Promise<A> {
  return n === 0
    ? Promise.reject(new Error(`Failed after ${n} attempts`))
    : p().catch(() => repeatP(n - 1, p));
}

// Runs a promise `i` milliseconds in the future
function sleepP<A>(i: number, p: () => Promise<A>): Promise<A> {
  return new Promise((resolve, reject) => {
    setTimeout(() => p().then(resolve, reject), i);
  });
}

// Runs a promise `p` every `sleep` milliseconds until the result passes a validation test `pred`
// and fails after `max` attempts
function pollP<A>(max: number, sleep: number, p: () => Promise<A>, pred: A => boolean): Promise<A> {
  return repeatP(max, () => sleepP(sleep, () => p().then(a => (pred(a) ? Promise.reject() : a))));
}

// Logs any error produced by the promise
function logP<A>(p: Promise<A>): Promise<A> {
  return p.catch((error) => {
    logException(error);
    throw error;
  });
}

export {
  repeatP,
  sleepP,
  pollP,
  logP,
};
