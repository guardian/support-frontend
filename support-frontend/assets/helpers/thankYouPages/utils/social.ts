import type { IsoCountry } from 'helpers/internationalisation/country';

const appendReferralCode = (
	url: string,
	platform: string,
	referralCode: string | null | undefined,
): string =>
	referralCode
		? encodeURI(`${url}&referralData=thankyou_${platform}_${referralCode}`)
		: encodeURI(url);

const INTCMP_FACEBOOK = 'component-share-facebook';
const INTCMP_TWITTER = 'component-share-twitter';
const INTCMP_MAIL = 'component-share-mail';
const LANDING_PAGE_URL = 'https://support.theguardian.com/support';

const emailLandingPageUrl = (
	campaignCode: string | null | undefined,
	referralCode: string | null | undefined,
): string => {
	const intcmp = campaignCode ? `${INTCMP_MAIL}-${campaignCode}` : INTCMP_MAIL;
	return appendReferralCode(
		`${LANDING_PAGE_URL}?INTCMP=${intcmp}`,
		'email',
		referralCode,
	);
};

const TWITTER_TEXT_COPY =
	'Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard the Guardian’s future – so more people, across the world, can keep accessing factual information for free';
const TWITTER_TEXT_COPY_AU =
	'I support Guardian Australia because I believe in rigorous, independent journalism that’s open for everyone to read. Join me by making a contribution and together we can be a voice for change. #supportGuardianAustralia';

const emailSubjectCopy = (countryId: IsoCountry) =>
	countryId === 'AU'
		? 'Join me in supporting Guardian Australia'
		: 'Join me in supporting open, independent journalism';

const emailBodyCopy = (
	countryId: IsoCountry,
	campaignCode: string | null | undefined,
	referralCode: string | null | undefined,
) =>
	countryId === 'AU'
		? `I support Guardian Australia because I believe in rigorous, independent journalism that’s open for everyone to read. Join me by making a contribution and together we can be a voice for change. #supportGuardianAustralia \r\n${emailLandingPageUrl(
				campaignCode,
				referralCode,
		  )}`
		: `Join me and over one million others in supporting a different model for open, independent journalism. Together we can help safeguard the Guardian’s future – so more people, across the world, can keep accessing factual information for free: ${emailLandingPageUrl(
				campaignCode,
				referralCode,
		  )}`;

export const getFacebookShareLink = (
	campaignCode: string | null | undefined,
	referralCode: string | null | undefined,
): string => {
	const intcmp = campaignCode
		? `${INTCMP_FACEBOOK}-${campaignCode}`
		: INTCMP_FACEBOOK;
	const landingPageUrl = `${LANDING_PAGE_URL}?INTCMP=${intcmp}`;
	const encodedUrl = appendReferralCode(
		landingPageUrl,
		'facebook',
		referralCode,
	);
	return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};
export const getTwitterShareLink = (
	countryId: IsoCountry,
	campaignCode: string | null | undefined,
	referralCode: string | null | undefined,
): string => {
	const intcmp = campaignCode
		? `${INTCMP_TWITTER}-${campaignCode}`
		: INTCMP_TWITTER;
	const landingPageUrl = `${LANDING_PAGE_URL}?INTCMP=${intcmp}`;
	const encodedUrl = appendReferralCode(
		landingPageUrl,
		'twitter',
		referralCode,
	);
	const encodedText = encodeURI(
		countryId === 'AU' ? TWITTER_TEXT_COPY_AU : TWITTER_TEXT_COPY,
	);
	return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
};
export const getLinkedInShareLink = (
	referralCode: string | null | undefined,
): string => {
	const encodedUrl = appendReferralCode(
		LANDING_PAGE_URL,
		'linkedin',
		referralCode,
	);
	return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
};
export const getEmailShareLink = (
	countryId: IsoCountry,
	campaignCode: string | null | undefined,
	referralCode: string | null | undefined,
): string => {
	const encodedSubject = encodeURI(emailSubjectCopy(countryId));
	const encodedBody = encodeURI(
		emailBodyCopy(countryId, campaignCode, referralCode),
	);
	return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};
