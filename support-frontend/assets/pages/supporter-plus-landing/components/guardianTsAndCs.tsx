import { css } from '@emotion/react';
import { space, textSans } from '@guardian/source-foundations';
import { privacyLink } from 'helpers/legal';

const fontStyles = css`
	${textSans.xxsmall({ lineHeight: 'regular' })};
	color: #606060;
`;

const marginBottom = css`
	margin-bottom: ${space[3]}px;
`;

export function GuardianTsAndCs(): JSX.Element {
	return (
		<div css={fontStyles}>
			<p css={marginBottom}>
				The ultimate owner of the Guardian is The Scott Trust Limited, whose
				role it is to secure the editorial and financial independence of the
				Guardian in perpetuity. Reader contributions support the Guardian’s
				journalism. Please note that your support of the Guardian’s journalism
				does not constitute a charitable donation, as such your contribution is
				not eligible for Gift Aid in the UK nor a tax-deduction elsewhere.
			</p>
			<p>
				To find out what personal data we collect and how we use it, visit our{' '}
				<a css={fontStyles} href={privacyLink}>
					Privacy Policy
				</a>
				.
			</p>
		</div>
	);
}
