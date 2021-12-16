const EventualSentry = import('@sentry/browser');

// ----- Functions ----- //
const init = (): Promise<void> =>
	EventualSentry.then((Sentry) => {
		const dsn = 'https://65f7514888b6407881f34a6cf1320d06@sentry.io/1213654';

		const { gitCommitId } = window.guardian;

		Sentry.init({
			dsn,
			whitelistUrls: ['support.theguardian.com'],
			release: gitCommitId,
		});
	});

const logException = (ex: string, context?: Record<string, unknown>): void => {
	void EventualSentry.then((Sentry) => {
		Sentry.captureException(new Error(ex), {
			extra: context,
		});

		console.error('sentry exception: ', ex);
	});
};

// ----- Exports ----- //
export { init, logException };
