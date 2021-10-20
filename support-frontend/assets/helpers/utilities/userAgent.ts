// ----- Types ----- //
// ----- Setup ----- //
const userAgent = window.navigator.userAgent || '';
// ----- Functions ----- //
// scans user agent for presence of 'safari' and absence of 'chrome' or 'android'
// (chrome and android browsers also include 'safari' in the UA string)
const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
// ----- Exports ----- //
export { isSafari };
