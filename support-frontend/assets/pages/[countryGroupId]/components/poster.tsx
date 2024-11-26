import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineBold34,
	palette,
	space,
	textSans17,
	textSans20,
} from '@guardian/source/foundations';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import GridImage from 'components/gridImage/gridImage';
import { ComponentContainer } from './componentContainer';

const container = css`
	background-color: ${palette.neutral[97]};
	> div {
		${from.tablet} {
			max-width: 740px;
		}
	}
`;
const headingContainer = css`
	display: flex;
	flex-direction: column;
	${from.tablet} {
		align-items: center;
	}
`;
const heading = css`
	color: ${palette.neutral[7]};
	text-align: left;
	${headlineBold24}
	${from.tablet} {
		max-width: 340px;
		text-align: center;
	}
	${from.desktop} {
		max-width: 540px;
		${headlineBold34}
	}
`;
const divider = css`
	display: none;
	${from.tablet} {
		display: block;
		width: 100%;
		margin: ${space[3]}px 0;
	}
	${from.desktop} {
		margin-top: ${space[6]}px;
	}
`;
const bodyContainer = css`
	display: flex;
	flex-direction: column;
	${from.tablet} {
		flex-direction: row;
		justify-content: space-between;
	}
`;
const copy = css`
	text-align: left;
	color: ${palette.neutral[10]};
	padding-top: ${space[1]}px;
	${textSans17};
	${from.tablet} {
		padding-top: ${space[2]}px;
	}
	${from.desktop} {
		${textSans20};
	}
`;
const paragraph = css`
	margin-bottom: ${space[3]}px;
`;
const image = css`
	display: flex;
	flex-direction: row;
	justify-content: center;
	${from.tablet} {
		max-width: 200px;
	}
`;

export function Poster(): JSX.Element {
	return (
		<ComponentContainer cssOverrides={container}>
			<div css={headingContainer}>
				<h2 css={heading}>Advertising revenue funds Guardian journalism</h2>
				<Divider cssOverrides={divider} />
			</div>
			<div css={bodyContainer}>
				<div css={copy}>
					<p css={paragraph}>
						The Guardian relies on advertising, alongside other revenue streams,
						to fund our journalism. In recent years, our ability to generate
						revenue from online advertising has been impacted by an increase in
						the number of readers who reject personalised advertising.
					</p>
					<p css={paragraph}>
						As a result, we are now asking readers to pay to reject personalised
						advertising.
					</p>
				</div>
				<div css={image}>
					<GridImage
						classModifiers={['']}
						gridId={'guardianLightPackshot'}
						srcSizes={[500, 140]}
						sizes="200px"
						imgType="png"
					/>
				</div>
			</div>
		</ComponentContainer>
	);
}
