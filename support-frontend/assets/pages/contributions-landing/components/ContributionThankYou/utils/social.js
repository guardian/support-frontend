// @flow

const appendReferralCode = (url: string, platform: string, referralCode: ?string): string =>
  (referralCode ?
    encodeURI(`${url}&referralData=thankyou_${platform}_${referralCode}`) :
    encodeURI(url));

const INTCMP_FACEBOOK = 'component-share-facebook';
const INTCMP_TWITTER = 'component-share-twitter';
const INTCMP_MAIL = 'component-share-mail';
const LANDING_PAGE_URL = 'https://support.theguardian.com/contribute';
const LANDING_PAGE_URL_FACEBOOK = `${LANDING_PAGE_URL}?INTCMP=${INTCMP_FACEBOOK}`;
const LANDING_PAGE_URL_TWITTER = `${LANDING_PAGE_URL}?INTCMP=${INTCMP_TWITTER}`;

const emailLandingPageUrl = (referralCode: ?string) =>
  appendReferralCode(`${LANDING_PAGE_URL}?INTCMP=${INTCMP_MAIL}`, 'email', referralCode);

const twitterTextCopy = (isUsEndOfYearAppeal: boolean) =>
  (isUsEndOfYearAppeal
    ? 'Join me and support the Guardian’s open, independent journalism for 2021 and beyond. You can contribute today from as little as $1. Together we’re doing something powerful.'
    : 'Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free');

const emailBodyCopy = (referralCode: ?string, isUsEndOfYearAppeal: boolean) =>
  (isUsEndOfYearAppeal
    ? `Join me and support the Guardian’s open, independent journalism for 2021 and beyond. You can contribute today from as little as $1. Together we’re doing something powerful. #supporttheguardian - ${emailLandingPageUrl(referralCode)}`
    : `Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free: ${emailLandingPageUrl(referralCode)}`);

const emailSubject = (isUsEndOfYearAppeal: boolean) =>
  (isUsEndOfYearAppeal
    ? 'Join me in supporting the Guardian'
    : 'Join me in supporting open, independent journalism');

export const getFacebookShareLink = (referralCode: ?string): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL_FACEBOOK, 'facebook', referralCode);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

export const getTwitterShareLink = (referralCode: ?string, isUsEndOfYearAppeal: ?boolean): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL_TWITTER, 'twitter', referralCode);
  const encodedText = encodeURI(twitterTextCopy(isUsEndOfYearAppeal));
  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}${isUsEndOfYearAppeal ? '&hashtags=supporttheguardian' : ''}`;
};

export const getLinkedInShareLink = (referralCode: ?string): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL, 'linkedin', referralCode);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
};

export const getEmailShareLink = (referralCode: ?string, isUsEndOfYearAppeal: ?boolean): string => {
  const encodedSubject = encodeURI(emailSubject(isUsEndOfYearAppeal));
  const encodedBody = encodeURI(emailBodyCopy(referralCode, isUsEndOfYearAppeal));
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};
