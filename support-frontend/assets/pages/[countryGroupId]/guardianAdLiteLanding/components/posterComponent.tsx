import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold34,
	palette,
	space,
	textEgyptian17,
	until,
} from '@guardian/source/foundations';
import { Container } from 'components/layout/container';

const container = css`
	background-color: ${palette.neutral[97]};
	> div {
		padding-top: ${space[6]}px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.tablet} {
			padding-top: 0px;
			display: flex;
			justify-content: center;
		}
	}
`;
const headingContentContainer = css`
	${from.tablet} {
		min-height: 404px;
	}
	${from.desktop} {
		max-width: 940px;
	}
`;
const bodyContainer = css`
	color: ${palette.neutral[100]};
	background-color: ${palette.brand[400]};
	border-radius: ${space[3]}px;
	display: flex;
	flex-direction: column;
	padding: ${space[3]}px;
	${from.tablet} {
		flex-direction: row;
		justify-content: space-between;
		padding: ${space[5]}px ${space[6]}px;
	}
`;
const heading = css`
	text-align: left;
	${headlineBold28}
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		max-width: 340px;
		margin-bottom: ${space[4]}px;
	}
	${from.desktop} {
		max-width: 540px;
		${headlineBold34}
		margin-bottom: ${space[5]}px;
	}
`;
const headingColor = css`
	color: ${palette.brandAlt[400]};
`;
const copy = css`
	text-align: left;
	padding-top: ${space[1]}px;
	${textEgyptian17};
	${from.tablet} {
		padding-top: ${space[2]}px;
	}
`;
const paragraph = css`
	margin-bottom: ${space[3]}px;
`;
const displayMobile = css`
	${until.desktop} {
		display: inherit;
	}
`;
const displayDesktop = css`
	${from.desktop} {
		display: inherit;
	}
`;
const image = css`
	display: none;
	width: 100%;
	object-fit: contain;
	${from.tablet} {
		max-width: 333px;
	}
`;

const posterImageUrlMobile = `https://i.guim.co.uk/img/media/49109ff732b9fab51a496d015118504a07a7a69e/0_0_1396_1137/1396.png?width=1396&quality=75&s=ead4f371d212d1229c6bcce7fa936c2d`;
const posterImageUrlDesktop = `https://i.guim.co.uk/img/media/5266c336f47108db31f68911d30f5259c8eed277/0_0_1424_1509/1424.png?width=1424&quality=75&s=485d4a200fc9428fc47c93e45f1bde2a`;

export function PosterComponent(): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			<div css={headingContentContainer}>
				<div css={bodyContainer}>
					<div css={copy}>
						<h2 css={heading}>
							This is annoying.
							<br />
							<span css={headingColor}>Why are you doing it?</span>
						</h2>
						<p css={paragraph}>
							The Guardian is lucky to have a unique ownership structure and a
							revenue model powered by the direct support of many of our
							readers. However, advertising remains a crucial part of how we
							fund our journalism.
						</p>
						<p css={paragraph}>
							Readers choosing to reject personalised advertising make it more
							difficult for us to generate revenue from online advertising. Put
							simply, that means that the more people who press “reject”, the
							less money to pay for quality reporting.
						</p>
						<p css={paragraph}>
							As a result, we are now asking readers to pay to reject
							personalised advertising.
						</p>
					</div>
					<img css={[displayMobile, image]} src={posterImageUrlMobile} />
					<img css={[displayDesktop, image]} src={posterImageUrlDesktop} />
				</div>
			</div>
		</Container>
	);
}
