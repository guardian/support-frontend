import { logException } from 'helpers/utilities/logger';

// Repeats a promise a maximum of `n` times, until it succeeds or bottoms out
function repeatPromise<A>(n: number, p: () => Promise<A>): Promise<A> {
	return n === 0 ? Promise.reject() : p().catch(() => repeatPromise(n - 1, p));
}

// Runs a promise `i` milliseconds in the future
function sleepPromise<A>(i: number, p: () => Promise<A>): Promise<A> {
	return new Promise((resolve, reject) => {
		setTimeout(() => p().then(resolve, reject), i);
	});
}

// Runs a promise `p` every `sleep` milliseconds until the result passes a validation test `pred`
// and fails after `max` attempts
function pollUntilPromise<A>(
	max: number,
	sleep: number,
	p: () => Promise<A>,
	pred: (arg0: A) => boolean,
): Promise<A> {
	const innerPromise = () => p().then((a) => (pred(a) ? Promise.reject() : a));

	return repeatPromise(max, () => sleepPromise(sleep, innerPromise));
}

// Logs any error produced by the promise
function logPromise<A>(p: Promise<A>): Promise<A> {
	return p.catch((error) => {
		logException(error);
		throw error;
	});
}

export { pollUntilPromise, logPromise };
