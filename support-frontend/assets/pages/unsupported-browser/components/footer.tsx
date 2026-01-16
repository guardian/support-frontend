import { defaultContributionEmail, privacyLink } from 'helpers/legal';
import { gu_v_spacing } from 'stylesheets/emotion/layout';
import { boxAlignment } from '../unsupportedBrowserStyles';
import {
	copyrightAndLegalStyles,
	footerContainer,
	legalLinkStyles,
	legalStyles,
	privacyLinkStyles,
} from './footerStyles';

export default function Footer(): JSX.Element {
	return (
		<div css={[boxAlignment(gu_v_spacing, 0), footerContainer]}>
			<a css={privacyLinkStyles} href={privacyLink}>
				Privacy Policy
			</a>
			<small css={copyrightAndLegalStyles}>
				© 2018 Guardian News and Media Limited or its affiliated companies. All
				rights reserved.
			</small>
			<p css={[copyrightAndLegalStyles, legalStyles]}>
				The ultimate owner of the Guardian is The Scott Trust Limited, whose
				role it is to secure the editorial and financial independence of the
				Guardian in perpetuity. Reader contributions support the Guardian’s
				journalism. Please note that your support of the Guardian’s journalism
				does not constitute a charitable donation, as such your contribution is
				not eligible for Gift Aid in the UK nor a tax-deduction elsewhere. If
				you have any questions about contributing to the Guardian, please{' '}
				<a css={legalLinkStyles} href={defaultContributionEmail}>
					contact us here
				</a>
				.
			</p>
		</div>
	);
}
