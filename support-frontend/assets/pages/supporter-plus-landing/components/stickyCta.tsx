import { css, ThemeProvider } from '@emotion/react';
import {
	brand,
	from,
	space,
	visuallyHidden,
} from '@guardian/source-foundations';
import type { LinkButtonProps } from '@guardian/source-react-components';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source-react-components';

const stickyContainerCss = (isVisible: boolean) => css`
	display: flex;
	flex-direction: column;
	position: sticky;
	bottom: -4px;
	background-color: ${brand[400]};
	padding: ${space[5]}px 0 30px;

	${isVisible ? '' : visuallyHidden}

	${from.tablet} {
		display: none;
	}
`;

const buttonOverrides = css`
	justify-content: center;
`;

type StickyCtaProps = {
	isVisible: boolean;
	ctaLink: string;
	onCtaClick: LinkButtonProps['onClick'];
	buttonText: string;
	ariaControls: string;
};

export default function StickyCta({
	isVisible,
	ctaLink,
	onCtaClick,
	buttonText,
	ariaControls,
}: StickyCtaProps): JSX.Element {
	return (
		<section css={stickyContainerCss(isVisible)}>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<LinkButton
					cssOverrides={buttonOverrides}
					size="small"
					onClick={onCtaClick}
					href={ctaLink}
					aria-controls={ariaControls}
					aria-expanded={!isVisible}
				>
					{buttonText}
				</LinkButton>
			</ThemeProvider>
		</section>
	);
}
