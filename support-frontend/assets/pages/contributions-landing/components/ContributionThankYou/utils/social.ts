const appendReferralCode = (url: string, platform: string, referralCode: string | null | undefined): string => referralCode ? encodeURI(`${url}&referralData=thankyou_${platform}_${referralCode}`) : encodeURI(url);

const INTCMP_FACEBOOK = 'component-share-facebook';
const INTCMP_TWITTER = 'component-share-twitter';
const INTCMP_MAIL = 'component-share-mail';
const LANDING_PAGE_URL = 'https://support.theguardian.com/contribute';
const LANDING_PAGE_URL_FACEBOOK = `${LANDING_PAGE_URL}?INTCMP=${INTCMP_FACEBOOK}`;
const LANDING_PAGE_URL_TWITTER = `${LANDING_PAGE_URL}?INTCMP=${INTCMP_TWITTER}`;

const emailLandingPageUrl = (referralCode: string | null | undefined) => appendReferralCode(`${LANDING_PAGE_URL}?INTCMP=${INTCMP_MAIL}`, 'email', referralCode);

const TWITTER_TEXT_COPY = 'Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free';
const EMAIL_SUBJECT_COPY = 'Join me in supporting open, independent journalism';

const emailBodyCopy = (referralCode: string | null | undefined) => `Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard The Guardian’s future – so more people, across the world, can keep accessing factual information for free: ${emailLandingPageUrl(referralCode)}`;

export const getFacebookShareLink = (referralCode: string | null | undefined): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL_FACEBOOK, 'facebook', referralCode);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};
export const getTwitterShareLink = (referralCode: string | null | undefined): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL_TWITTER, 'twitter', referralCode);
  const encodedText = encodeURI(TWITTER_TEXT_COPY);
  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
};
export const getLinkedInShareLink = (referralCode: string | null | undefined): string => {
  const encodedUrl = appendReferralCode(LANDING_PAGE_URL, 'linkedin', referralCode);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
};
export const getEmailShareLink = (referralCode: string | null | undefined): string => {
  const encodedSubject = encodeURI(EMAIL_SUBJECT_COPY);
  const encodedBody = encodeURI(emailBodyCopy(referralCode));
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};