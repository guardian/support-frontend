import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { SvgChevronRightSingle } from '@guardian/source-react-components';
import { useEffect } from 'preact/hooks';

const cardContainerCss = css`
	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;

	&:hover {
		cursor: pointer;
	}

	:not(:last-child) {
		margin-bottom: ${space[2]}px;

		${from.tablet} {
			margin-bottom: ${space[4]}px;
		}
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
		const cards = Array.from(document.querySelectorAll('.card'));
		let elements: Element[] = [];
		cards.forEach((card) => {
			elements = elements.concat(Array.from(card.children));
		});

		elements.forEach((element) => {
			// click: Disable
			element.addEventListener('click', (e) => e.preventDefault());

			// mousedown: Log timestamp
			element.addEventListener('mousedown', (e) => {
				const card: Element | null = (e.target as HTMLElement).closest('.card');
				if (card) {
					const mousedownTime = new Date().getTime();
					card.setAttribute('data-md', mousedownTime.toString());
				}
			});

			// mouseup: Determine whether to raise click event
			element.addEventListener('mouseup', (e) => {
				e.stopPropagation();

				const card: Element | null = (
					e.target as HTMLElement
				).classList.contains('card')
					? (e.target as HTMLElement)
					: (e.target as HTMLElement).closest('.card');

				if (card) {
					const mouseupTime = new Date().getTime();
					const foundMouseDown = card.getAttribute('data-md');
					const mousedownTime = foundMouseDown
						? parseInt(foundMouseDown)
						: mouseupTime;

					if (mouseupTime - mousedownTime < 200) {
						cardClickableProp.onCardClick();
						card.classList.add('visited');
					}
					card.removeAttribute('data-md');
				}
			});
		});
	}, []);

	return (
		<div className="card" css={cardContainerCss}>
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
	);
}
