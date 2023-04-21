import { css } from '@emotion/react';
import {
	brand,
	focus,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { SvgChevronRightSingle } from '@guardian/source-react-components';

const cardContainerCss = css`
	position: relative;

	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;
	&:hover {
		cursor: pointer;
	}

	${from.desktop} {
		padding: ${space[5]}px ${space[6]}px;
	}

	:not(:last-child) {
		margin-bottom: ${space[2]}px;
		${from.tablet} {
			margin-bottom: ${space[4]}px;
		}
	}

	html:not(.src-focus-disabled) &:focus {
		outline: 5px solid ${focus[400]};
		outline-offset: -5px;
	}
`;
const cardClickableAreaPseudoCss = css`
	::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
`;
const cardTopCss = css`
	${from.desktop} {
		margin-left: 2px;
	}
`;
const cardBottomCss = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	${until.desktop} {
		margin-left: ${space[1]}px;
	}
`;
const headingCss = (color: string) => css`
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	color: ${color};
	${from.desktop} {
		${headline.xsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
	}
`;

const paraCss = css`
	text-align: left;
	${textSans.small({ lineHeight: 'regular' })};
	${from.desktop} {
		${textSans.medium({ lineHeight: 'regular' })};
	}
`;
const chevronCss = css`
	color: #606060;
	background-color: transparent;
	&:hover {
		background-color: transparent;
	}
	& svg {
		width: ${space[6]}px;
		margin: 2px;
	}
`;

export type CardClickableProps = {
	cardTitle: string;
	cardParagraph: string;
	onCardClick: () => void;
};

export function CardClickable({
	cardTitle,
	cardParagraph,
	onCardClick,
}: CardClickableProps): JSX.Element | null {
	return (
		<div css={cardContainerCss} tabIndex={0}>
			<div css={cardTopCss}>
				<h2 css={headingCss(brand[500])}>
					<a onClick={onCardClick} css={cardClickableAreaPseudoCss}>
						{cardTitle}
					</a>
				</h2>
			</div>
			<div css={cardBottomCss}>
				<p css={paraCss}>{cardParagraph}</p>
				<div css={chevronCss}>
					<SvgChevronRightSingle size="xsmall" />
				</div>
			</div>
		</div>
	);
}
