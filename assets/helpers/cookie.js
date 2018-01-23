// @flow

// ----- Functions ----- //

// Trim subdomains for prod, code and dev.
const getDomain = (): string => {
  const domain = document.domain || '';
  return domain.replace(/^(www|m\.code|dev|m|support)\./, '.');
};

const getDomainAttribute = (useSubDomain: boolean): string => {
  const domain = getDomain();
  const subDomain = document.domain || '';

  if (domain === 'localhost') {
    return '';
  }
  return useSubDomain ? ` domain=${subDomain};` : ` domain=${domain};`;
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


const getExpires = (daysToLive: ?number) => {
  const expires = new Date();

  if (daysToLive) {
    expires.setDate(expires.getDate() + daysToLive);
  } else {
    expires.setMonth(expires.getMonth() + 5);
    expires.setDate(1);
  }
  return expires;
};

// Sets a cookie, modified from dotcom (https://github.com/guardian/frontend).
export function set(name: string, value: string, daysToLive: ?number): void {
  const expires = getExpires(daysToLive);
  document.cookie = `${name}=${value}; path=/; secure; expires=${expires.toUTCString()};${getDomainAttribute(false)}`;
}


// Sets a cookie with on the fully qualified domain name
export function setSubDomain(name: string, value: string, daysToLive: ?number): void {
  const expires = getExpires(daysToLive);
  document.cookie = `${name}=${value}; path=/; secure; expires=${expires.toUTCString()};${getDomainAttribute(true)}`;
}
