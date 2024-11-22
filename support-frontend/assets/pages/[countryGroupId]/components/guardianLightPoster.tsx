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
	background-color: #f6f6f6;
	> div {
		display: flex;
		justify-content: center;
		padding: ${space[5]}px 10px;
	}
`;
const innerContainer = css`
	max-width: 940px;
	text-align: center;
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
		max-width: 340px;
	}
	${from.desktop} {
		${headlineBold34}
	}
`;
const divider = css`
	display: none;
	${from.tablet} {
		display: block;
		width: 100%;
		margin: ${space[4]}px 0;
	}
	${from.desktop} {
		margin: ${space[6]}px 0 ${space[3]}px;
	}
`;
const bodyContainer = css`
	display: flex;
	justify-content: center;
	flex-direction: column;
	${from.tablet} {
		justify-content: space-between;
		flex-direction: row;
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
	${from.tablet} {
		max-width: 200px;
	}
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
					<div css={copy}>
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
			</div>
		</Container>
	);
}
