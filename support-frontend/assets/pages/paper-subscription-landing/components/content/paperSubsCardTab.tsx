// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import { PaperCarouselTab } from './paperTabCarousel';
import { PaperTabHero } from './paperTabHero';
import { PaperTabTsAndCs } from './paperTabTsAndCs';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;
	background-color: ${neutral['97']};

	${from.tablet} {
		flex-direction: column;
	}
`;

export function PaperSubsCardTab(): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<PaperTabHero
				topParagraph={`The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with news kiosks in the UK such as McColl's, Co-op, One Stop and selected SPAR stores.`}
				bottomParagraph={`You can collect the newspaper from your local store or have your copies delivered by your newsagent.`}
			/>
			<PaperCarouselTab />
			<PaperTabTsAndCs />
		</FlexContainer>
	);
}
