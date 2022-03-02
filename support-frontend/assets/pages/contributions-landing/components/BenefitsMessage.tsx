import { css } from '@emotion/react';
import {
	brandAlt,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

const container = css`
	border-top: 1px solid ${neutral[86]};
	border-bottom: 1px solid ${neutral[86]};
	margin: ${space[6]}px 0 ${space[3]}px 0;
	padding: ${space[3]}px 0 ${space[4]}px 0;
`;

const title = css`
	${textSans.medium({ fontWeight: 'bold', lineHeight: 'regular' })};
	margin-bottom: 6px;
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

	const shouldBeHighlighted =
		countryGroupId === 'AUDCountries' ||
		countryGroupId === 'UnitedStates' ||
		countryGroupId === 'International' ||
		countryGroupId === 'NZDCountries' ||
		countryGroupId === 'Canada';

	return (
		<div css={container}>
			<h3 css={title}>Supporter extras</h3>
			<p css={body}>
				To say thank you for your recurring contribution, our executive editor
				will email you <span>{frequency}</span>,{' '}
				<span css={shouldBeHighlighted && highlighted}>
					giving you an exclusive insight into our newsroom.
				</span>{' '}
				And we will stop asking you to fund our work as often.
			</p>
		</div>
	);
}

export default BenefitsMessage;
