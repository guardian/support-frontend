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
import { ComponentContainer } from './componentContainer';

const container = css`
	color: ${palette.neutral[100]};
	background-color: ${palette.brand[400]};
	border-radius: ${space[3]}px;
	> div {
		${from.tablet} {
			max-width: 740px;
		}
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
const heading = css`
	text-align: left;
	${headlineBold24}
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
	width: 100%;
	object-fit: contain;
	${from.tablet} {
		max-width: 333px;
	}
`;

const posterImageUrl = `https://i.guim.co.uk/img/media/a3e6d39656007bf310093a2a934155abbfe10a49/0_0_794_794/794.png?width=500&quality=75&s=e74bca9368c32efdf60855a9ac714f17`;

export function PosterComponent(): JSX.Element {
	return (
		<ComponentContainer cssOverrides={container}>
			<div css={bodyContainer}>
				<div css={copy}>
					<h2 css={heading}>
						This is annoying.
						<br />
						<span css={headingColor}>Why are you doing it?</span>
					</h2>
					<p css={paragraph}>
						The Guardian is lucky to have a unique ownership structure and a
						revenue model powered by the direct support of many of our readers.
						However advertising remains a crucial part of how we fund our
						journalism.
					</p>
					<p css={paragraph}>
						Readers choosing to reject personalised advertising makes it more
						difficult for us to generate revenue from online advertising. Put
						simply, that means that the more people who press “reject”, the less
						money to pay for quality reporting.
					</p>
					<p css={paragraph}>
						As a result, we are now asking readers to pay to reject personalised
						advertising.
					</p>
				</div>
				<img css={image} alt="" src={posterImageUrl} />
			</div>
		</ComponentContainer>
	);
}
