import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;

	img {
		${until.leftCol} {
			display: none;
		}
	}
`;

export function PaperTabHero(): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			PaperTabHero
			<div>
				<div>
					<p>text block1</p>
					<p>text block2</p>
					<p>drop down</p>
				</div>
				<div>image</div>
			</div>
		</FlexContainer>
	);
}
