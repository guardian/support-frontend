import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSans12,
	textSans17,
} from '@guardian/source/foundations';
import { BackToTop, Container } from '@guardian/source/react-components';

const footer = css`
	background-color: #000;
	color: ${neutral[100]};
	padding-bottom: ${space[1]}px;
	${textSans17};
`;

const contentWrapperStyles = css`
	display: flex;
	position: relative;
	height: 60px;
`;

const copyrightStyles = css`
	display: block;
	${textSans12};
	padding-top: ${space[6]}px;
	padding-bottom: 18px;
	${from.tablet} {
		padding-top: ${space[3]}px;
	}
`;

const backToTopStyles = css`
	background-color: #000;
	padding: 0 ${space[2]}px;
	position: absolute;
	bottom: -21px;
	right: ${space[3]}px;
	${from.tablet} {
		padding: 0 5px;
		right: 0;
	}
	a {
		background-color: #000;
	}
`;

export default function ObserverFooter() {
	return (
		<footer css={footer}>
			<Container sideBorders>
				<div css={contentWrapperStyles}>
					<div css={backToTopStyles}>{BackToTop}</div>
				</div>
			</Container>
			<Container topBorder>
				<small css={copyrightStyles}>
					© {new Date().getFullYear()} Tortoise Media
				</small>
			</Container>
		</footer>
	);
}
