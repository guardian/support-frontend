import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

const container = css`
	border-top: 1px solid ${neutral[86]};
	border-bottom: 1px solid ${neutral[86]};
	margin: ${space[5]}px 0 ${space[3]}px 0;
	padding: 6px 0 ${space[3]}px 0;

	${from.desktop} {
		margin: ${space[6]}px 0 ${space[3]}px 0;
	}
`;

const title = css`
	${headline.xxxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	margin-bottom: 10px;

	${from.desktop} {
		font-size: 20px;
	}
`;

const body = css`
	${textSans.medium({ lineHeight: 'regular' })};
`;

const highlighted = css`
	font-weight: bold;
	background-color: ${brandAlt[400]};
`;

type PropTypes = {
	countryGroupId: CountryGroupId;
};

function BenefitsMessage({ countryGroupId }: PropTypes): JSX.Element {
	const frequency =
		countryGroupId === 'AUDCountries' || countryGroupId === 'UnitedStates'
			? 'regularly'
			: 'each week';

	return (
		<div css={container}>
			<h3 css={title}>Supporter extras</h3>
			<p css={body}>
				To say thank you for your recurring contribution, a senior editor will
				email you <span>{frequency}</span>,{' '}
				<span css={highlighted}>
					giving you an exclusive insight into our newsroom.
				</span>{' '}
				And we will stop asking you to fund our work as often.
			</p>
		</div>
	);
}

export default BenefitsMessage;
