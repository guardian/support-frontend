// @flow
declare var Raven: any;

// ----- Functions ----- //

export const init = () => {
  const dsn: string = 'https://dc13eb8698614a8081ce6a139d9f4aab@sentry.io/171710';

  Raven.config(dsn, {
    whitelistUrls: ['support.theguardian.com', 'localhost'],
  }).install();
};


export const logException = (ex: string, context?: Object): void => {
  Raven.captureException(ex,
    {
      extra: context,
    });

  if (window.console && console.error) {
    console.error(ex);
  }
};

