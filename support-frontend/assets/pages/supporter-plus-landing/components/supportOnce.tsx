import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { LinkButton } from '@guardian/source/react-components';
import {
	type CountryGroupId,
	countryGroups,
} from '@modules/internationalisation/countryGroup';
import { trackComponentClick } from 'helpers/tracking/behaviour';

const container = css`
	text-align: center;
`;

const heading = css`
	color: ${palette.neutral[7]};
	${headlineBold24}
	${between.tablet.and.desktop} {
		margin: 0 auto;
		max-width: 340px;
	}
	${from.desktop} {
		font-size: 2.125rem;
	}
`;

const standFirst = css`
	color: ${palette.neutral[10]};
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

interface SupportOnceProps {
	currency: string;
	countryGroupId: CountryGroupId;
}

export function SupportOnce({
	currency,
	countryGroupId,
}: SupportOnceProps): JSX.Element {
	return (
		<div css={container}>
			<h2 css={heading}>Support us just once</h2>
			<p css={standFirst}>
				We welcome support of any size, any time - whether you choose to
				give&nbsp;
				{currency}1 or more.
			</p>
			<LinkButton
				href={`/${countryGroups[countryGroupId].supportInternationalisationId}/one-time-checkout`}
				iconSide="left"
				priority="primary"
				size="default"
				cssOverrides={btnStyleOverrides}
				onClick={() => {
					trackComponentClick(
						`npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
					);
				}}
				data-qm-trackable="support-once-button"
				aria-label="Support once"
			>
				Support now
			</LinkButton>
		</div>
	);
}
