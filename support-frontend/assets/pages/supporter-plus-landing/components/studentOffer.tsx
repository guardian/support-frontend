import { css } from '@emotion/react';
import {
	between,
	from,
	headlineMedium34,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { LinkButton } from '@guardian/source/react-components';
import {
	type CountryGroupId,
	countryGroups,
} from '@modules/internationalisation/countryGroup';

const container = css`
	text-align: center;
	margin-bottom: ${space[4]}px;
`;

const heading = css`
	color: ${palette.neutral[7]};
	${headlineMedium34}
	${between.tablet.and.desktop} {
		margin: 0 auto;
		max-width: 340px;
	}
	${from.desktop} {
		font-size: 2.125rem;
	}
`;

const standFirst = css`
	color: ${palette.neutral[7]};
	${textSans17};
	line-height: 1.35;
	padding-top: ${space[1]}px;
	${from.tablet} {
		padding-top: ${space[2]}px;
		margin: 0 auto;
		max-width: 340px;
	}
	${from.desktop} {
		max-width: 500px;
	}
`;

const boldCopy = css`
	font-weight: bold;
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-top: ${space[6]}px;
	${from.tablet} {
		max-width: 340px;
	}
	${from.desktop} {
		max-width: 275px;
	}
`;

interface StudentOfferProps {
	currency: string;
	countryGroupId: CountryGroupId;
}

export function StudentOffer({
	currency,
	countryGroupId,
}: StudentOfferProps): JSX.Element {
	return (
		<div css={container}>
			<h2 css={heading}>Student subscription</h2>
			<p css={standFirst}>
				Keep up to date on the latest news with an{' '}
				<span css={boldCopy}>All&#x2011;access&nbsp;digital</span> subscription
				for just {currency}
				TBD&nbsp;a&nbsp;year.
			</p>
			<LinkButton
				href={`/${countryGroups[countryGroupId].supportInternationalisationId}/one-time-checkout`}
				priority="tertiary"
				size="default"
				cssOverrides={btnStyleOverrides}
				aria-label="Find out more"
			>
				Find out more
			</LinkButton>
		</div>
	);
}
