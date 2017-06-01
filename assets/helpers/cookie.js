// @flow

// ----- Functions ----- //

// Trim subdomains for prod, code and dev.
const getShortDomain = (): string => {

  const domain = document.domain || '';
  return domain.replace(/^(www|m\.code|dev|m|support)\./, '.');
};

const getDomainAttribute = (): string => {
  const shortDomain = getShortDomain();
  return shortDomain === 'localhost' ? '' : ` domain=${shortDomain};`;
};


// ----- Exports ----- //

export function get(name: string): ?string {

  const cookies = document.cookie.split('; ');

  for (let i = cookies.length - 1; i >= 0; i -= 1) {

    if (cookies[i].startsWith(name)) {
      return cookies[i].substr(cookies[i].indexOf('=') + 1);
    }

  }

  return null;

}

// Sets a cookie, modified from dotcom (https://github.com/guardian/frontend).
export function set(name: string, value: string, daysToLive: ?number): void {

  const expires = new Date();

  if (daysToLive) {
    expires.setDate(expires.getDate() + daysToLive);
  } else {
    expires.setMonth(expires.getMonth() + 5);
    expires.setDate(1);
  }

  document.cookie = `${name}=${value}; path=/; secure; expires=${expires.toUTCString()};${getDomainAttribute()}`;

}
