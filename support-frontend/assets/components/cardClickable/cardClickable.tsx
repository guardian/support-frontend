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
import { useEffect } from 'preact/hooks';

const containerCss = css`
	:not(:last-child) {
		margin-bottom: ${space[2]}px;

		${from.tablet} {
			margin-bottom: ${space[4]}px;
		}
	}
`;

const cardCss = css`
	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;

	&:hover {
		cursor: pointer;
	}

	/* .src-focus-disabled is added by the Source FocusStyleManager */
	html:not(.src-focus-disabled) &:focus {
		outline: 5px solid ${focus[400]};
		outline-offset: -5px;
	}

	${from.desktop} {
		padding: ${space[5]}px ${space[6]}px;
	}
`;
const topCss = css`
	${from.desktop} {
		margin-left: 2px;
	}
`;
const bottomCss = css`
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
		width: 24px;
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
	const cardClickableProp = { onCardClick };

	useEffect(() => {
		const cardClick = document.querySelector('.card');
		if (cardClick) {
			const elements = Array.from(cardClick.children);
			elements.forEach((element) => {
				// click: Disable
				element.addEventListener('click', (event) => event.preventDefault());

				// mousedown: Log timestamp
				element.addEventListener('mousedown', (event) => {
					const card = (event.target as HTMLElement).closest('.card');
					if (card) {
						const mousedownTime = new Date().getTime();
						card.setAttribute('time-mousedown', mousedownTime.toString());
					}
				});

				// mouseup: Determine whether to raise click event
				element.addEventListener('mouseup', (event) => {
					event.stopPropagation();
					const card = (event.target as HTMLElement).closest('.card');
					if (card) {
						const mouseUpTime = new Date().getTime();
						const mouseDownTime = parseInt(
							card.getAttribute('time-mousedown') ?? mouseUpTime.toString(),
						);
						if (mouseUpTime - mouseDownTime < 200) {
							cardClickableProp.onCardClick();
							card.classList.add('visited');
						}
						card.removeAttribute('time-mousedown');
					}
				});

				// focusin : Log
				element.addEventListener('focusin', (event) => {
					const card = (event.target as HTMLElement).closest('.card');
					if (card) {
						card.setAttribute('keyboard-focus', 'focusin');
					}
				});
				// focusout : Log
				element.addEventListener('focusout', (event) => {
					const card = (event.target as HTMLElement).closest('.card');
					if (card) {
						card.removeAttribute('keyboard-focus');
					}
				});

				// keypress: If card has focus and Enter pressed, raise click event
				element.addEventListener('keypress', (event) => {
					const card = (event.target as HTMLElement).closest('.card');
					if (card) {
						if (
							(event as KeyboardEvent).key === `Enter` &&
							card.getAttribute('keyboard-focus')
						) {
							cardClickableProp.onCardClick();
							card.classList.add('visited');
						}
					}
				});
			});
		}
	}, []);

	return (
		<div className="card" css={containerCss}>
			<div css={cardCss} tabIndex={0}>
				<div css={topCss}>
					<h2 css={headingCss(brand[500])}>{cardTitle}</h2>
				</div>
				<div css={bottomCss}>
					<p css={paraCss}>{cardParagraph}</p>
					<div css={chevronCss}>
						<SvgChevronRightSingle size="xsmall" />
					</div>
				</div>
			</div>
		</div>
	);
}
