// @flow
import Raven from 'raven-js';

// ----- Functions ----- //

const init = () => {
  const dsn: string = 'https://65f7514888b6407881f34a6cf1320d06@sentry.io/1213654';
  const { gitCommitId } = window.guardian;

  Raven.config(dsn, {
    whitelistUrls: ['support.theguardian.com', 'localhost'],
    release: gitCommitId,
  }).install();
};


const logException = (ex: string, context?: Object): void => {
  Raven.captureException(
    new Error(ex),
    {
      extra: context,
    },
  );

  if (window.console && console.error) {
    console.error(ex);
  }
};

const logInfo = (message: string): void => {
  Raven.captureMessage(
    message,
    {
      level: 'info',
    },
  );
};

// ----- Exports ----- //

export {
  init,
  logException,
  logInfo,
};
