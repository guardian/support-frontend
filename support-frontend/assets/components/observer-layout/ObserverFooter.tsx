import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { BackToTop, Container } from '@guardian/source/react-components';
import { observerColours } from './styles';

const footer = css`
	background-color: ${observerColours.footerBackgroundColor};
`;

const contentWrapperStyles = css`
	position: relative;
	height: 60px;
`;

const footerPadding = css`
	padding-bottom: ${space[12]}px;
`;

const backToTopStyles = css`
	position: absolute;
	background-color: ${observerColours.footerBackgroundColor};
	padding: 0 ${space[2]}px;
	bottom: -20px;
	right: ${space[3]}px;

	a {
		background-color: ${observerColours.footerBackgroundColor};
		> div:hover {
			background-color: ${observerColours.footerHoverColor};
		}
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
			<Container topBorder cssOverrides={footerPadding} />
		</footer>
	);
}
