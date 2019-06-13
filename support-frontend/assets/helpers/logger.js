// @flow
// import Raven from 'raven-js';

const EventualSentry = import('@sentry/browser');

// ----- Functions ----- //

const init = () => EventualSentry.then((Sentry) => {
  const dsn: string = 'https://65f7514888b6407881f34a6cf1320d06@sentry.io/1213654';
  const { gitCommitId } = window.guardian;

  Sentry.init({
    dsn,
    whitelistUrls: ['support.theguardian.com'],
    release: gitCommitId,
  });
});


const logException = (ex: string, context?: Object): void => {
  EventualSentry.then((Sentry) => {
    Sentry.captureException(
      new Error(ex),
      {
        extra: context,
      },
    );

    if (window.console && console.error) {
      console.error('sentry', ex);
    }
  });
};

const logInfo = (message: string): void => {
  EventualSentry.then((Sentry) => {
    Sentry.captureMessage(
      message,
      {
        level: 'info',
      },
    );
  });
};

// ----- Exports ----- //

export {
  init,
  logException,
  logInfo,
};
