import { css } from '@emotion/react';
import {
	between,
	from,
	headlineMedium24,
	headlineMedium34,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { LinkButton } from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import { productCatalog } from 'helpers/productCatalog';

const container = css`
	text-align: center;
	margin-bottom: ${space[4]}px;
`;

const heading = css`
	color: ${palette.neutral[7]};
	${headlineMedium24}
	${from.desktop} {
		${headlineMedium34}
	}
	${between.tablet.and.desktop} {
		margin: 0 auto;
		max-width: 340px;
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
		max-width: 422px;
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

const dividerContainer = css`
	margin: 0 auto ${space[8]}px auto;

	${from.desktop} {
		max-width: 940px;
	}
`;

const dividerCopy = css`
	${textSans17};
	color: ${palette.neutral[38]};
	display: flex;
	align-items: center;

	:before,
	:after {
		content: '';
		height: 1px;
		background-color: ${palette.neutral[86]};
		flex-grow: 2;
	}

	:before {
		margin-right: ${space[2]}px;
	}

	:after {
		margin-left: ${space[2]}px;
	}
`;

interface StudentOfferProps {
	currencyKey: IsoCurrency;
	countryGroupId: CountryGroupId;
}

export function StudentOffer({
	currencyKey,
	countryGroupId,
}: StudentOfferProps): JSX.Element {
	const price =
		productCatalog.SupporterPlus?.ratePlans['OneYearStudent']?.pricing[
			currencyKey
		];
	const currencyGlyph = currencies[currencyKey].glyph;

	// We don't expect this to happen, but don't render the copy with a missing
	// price if it ever does.
	if (!price) {
		return <></>;
	}

	return (
		<>
			<div css={dividerContainer}>
				<p css={dividerCopy}>More subscription options</p>
			</div>
			<div css={container}>
				<h2 css={heading}>Student subscription</h2>
				<p css={standFirst}>
					Keep up to date on the latest news with an{' '}
					<span css={boldCopy}>All&#x2011;access&nbsp;digital</span>{' '}
					subscription for just {currencyGlyph}
					{price}&nbsp;a&nbsp;year.
				</p>
				<LinkButton
					href={`/${countryGroups[countryGroupId].supportInternationalisationId}/student`}
					priority="tertiary"
					size="default"
					cssOverrides={btnStyleOverrides}
					aria-label="Find out more"
				>
					Find out more
				</LinkButton>
			</div>
		</>
	);
}
