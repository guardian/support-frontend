import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	headlineBold34,
	palette,
	space,
	textSans17,
	textSans20,
} from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import GridImage from 'components/gridImage/gridImage';

const container = css`
	display: flex;
	background-color: #f6f6f6;
	> div {
		padding: ${space[5]}px 10px;
	}
`;
const innerContainer = css`
	max-width: 940px;
	text-align: center;
`;
const divider = css`
	width: 100%;
	margin: ${space[4]}px 0;
	${from.desktop} {
		margin: ${space[6]}px 0;
	}
`;
const headingContainer = css`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const heading = css`
	max-width: 540px;
	color: ${palette.neutral[7]};
	${headlineBold24}
	${between.tablet.and.desktop} {
		margin: 0 auto;
		max-width: 340px;
	}
	${from.desktop} {
		${headlineBold34}
	}
`;

const bodyContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const copyContainer = css`
	flex-grow: 2;
	text-align: left;
	color: ${palette.neutral[10]};
	${textSans17};
	line-height: 1.35;
	padding-top: ${space[1]}px;
	${from.tablet} {
		padding-top: ${space[2]}px;
		margin: 0 auto;
	}
	${from.desktop} {
		${textSans20};
	}
`;
const paragraph = css`
	margin-bottom: ${space[3]}px;
`;
const imgContainer = css`
	flex-grow: 1;
	max-width: 200px;
`;

export function GuardianLightPoster(): JSX.Element {
	return (
		<Container sideBorders borderColor="#f6f6f6" cssOverrides={container}>
			<div css={innerContainer}>
				<div css={headingContainer}>
					<h2 css={heading}>Advertising revenue funds Guardian journalism</h2>
					<Divider cssOverrides={divider} />
				</div>
				<div css={bodyContainer}>
					<div css={copyContainer}>
						<p css={paragraph}>
							The Guardian relies on advertising, alongside other revenue
							streams, to fund our journalism. In recent years, our ability to
							generate revenue from online advertising has been impacted by an
							increase in the number of readers who reject personalised
							advertising.
						</p>
						<p css={paragraph}>
							As a result, we are now asking readers to pay to reject
							personalised advertising..
						</p>
					</div>
					<div css={imgContainer}>
						<GridImage
							classModifiers={['']}
							gridId={'guardianLightPackshot'}
							srcSizes={[500, 140]}
							sizes="200px"
							imgType="png"
						/>
					</div>
				</div>
			</div>
		</Container>
	);
}
