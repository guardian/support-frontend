import { css } from '@emotion/react';
import { from, palette, textSans12 } from '@guardian/source/foundations';
import { usePromoTerms } from 'contexts/PromoTermsContext';

const container = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${textSans12};
	line-height: 1.15;
	${from.desktop} {
		max-width: 780px;
	}
`;

export function ThreeTierTsAndCs(): JSX.Element {
	const { promoTerms } = usePromoTerms();

	return (
		<>
			{promoTerms.map(({ promoCode, description }) => (
				<div css={container} key={promoCode}>
					<p>{description}</p>
				</div>
			))}
		</>
	);
}
