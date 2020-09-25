// @flow

export const getFacebookShareLink = (url: string, referralCode?: string): string => {
  console.log(!!referralCode); // TODO: remove this, it's just here to appease the linter
  const encodedUrl = encodeURI(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

export const getTwitterShareLink = (url: string, text: string, referralCode?: string): string => {
  console.log(!!referralCode); // TODO: remove this, it's just here to appease the linter
  const encodedUrl = encodeURI(url);
  const encodedText = encodeURI(text);
  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
};

export const getLinkedInShareLink = (url: string, referralCode?: string): string => {
  console.log(!!referralCode); // TODO: remove this, it's just here to appease the linter
  const encodedUrl = encodeURI(url);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
};

export const getEmailShareLink = (subject: string, body: string, referralCode?: string): string => {
  console.log(!!referralCode); // TODO: remove this, it's just here to appease the linter
  const encodedSubject = encodeURI(subject);
  const encodedBody = encodeURI(body);
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};
