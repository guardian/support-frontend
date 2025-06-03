// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import { PaperCarouselTab } from './paperTabCarousel';
import { PaperTabHero } from './paperTabHero';
import { PaperTabTsAndCs } from './paperTabTsAndCs';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;

	${from.tablet} {
		flex-direction: column;
	}
`;

export function PaperDeliveryTab(): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<PaperTabHero
				topParagraph={
					'Use the Guardian’s home delivery service to get our newspaper direct to your door.'
				}
				bottomParagraph={`Select your subscription below and checkout. You'll receive your first newspaper as quickly as five days from subscribing.`}
			/>
			<PaperCarouselTab />
			<PaperTabTsAndCs />
		</FlexContainer>
	);
}
