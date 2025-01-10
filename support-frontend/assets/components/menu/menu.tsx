import { css } from '@emotion/react';
import {
	palette,
	textSans17,
	until,
	visuallyHidden,
} from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';

const root = css`
	background: ${palette.neutral[100]};
	border: 1px solid ${palette.neutral[93]};
	overflow: hidden;
	border-radius: 4px;

	${until.tablet} {
		position: fixed !important;
		top: auto;
		left: 0 !important;
		right: 0 !important;
		max-height: 70vh;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		/*accomodate iphone safari bottom bar popping out*/
		padding-bottom: 12px * 5;
		padding-bottom: 10vh;
		overflow: auto;
	}
`;

const item = css`
	box-sizing: border-box;
	display: block;
	${textSans17};
	padding: 0.375rem 5rem 1.125rem 1.25rem;
	color: ${palette.neutral[7]};
	text-decoration: none;
	position: relative;
	appearance: none;
	border: 0;
	width: 100%;
	text-align: left;
	cursor: pointer;

	&[data-is-selected] {
		font-weight: bold;
	}

	&:after {
		background: ${palette.neutral[93]};
		height: 1px;
		position: absolute;
		content: '';
		display: block;
		left: 1.25rem;
		bottom: 0;
		right: 0;
	}

	&:hover,
	&:focus {
		background: ${palette.neutral[97]};
		outline: none;
	}

	svg {
		position: absolute;
		right: 0.6375rem;
		height: 0.75rem;
		top: 0.6375rem;
		fill: ${palette.success[400]};
	}
`;

type ItemProps = {
	children: ReactNode;
	isSelected?: boolean;
};

function Item({
	isSelected,
	children,
	el: El,
	...props
}: ItemProps & {
	el: keyof JSX.IntrinsicElements;
}) {
	return (
		<El {...props} css={item} data-is-selected={isSelected}>
			{children}{' '}
			{isSelected && [
				<SvgCheckmark />,
				<span
					css={css`
						${visuallyHidden}
					`}
				>
					Selected
				</span>,
			]}
		</El>
	);
}

function LinkItem({
	children,
	...props
}: ItemProps & {
	href: string;
	onClick?: () => void;
}): JSX.Element {
	return (
		<Item el="a" {...props}>
			{children}
		</Item>
	);
}

function ButtonItem({ children, ...props }: ItemProps): JSX.Element {
	return (
		<Item el="button" {...props}>
			{children}
		</Item>
	);
}

function Menu({
	children,
	...props
}: {
	children: ReactNode;
	style?: Record<string, string | number>;
}): JSX.Element {
	return (
		<div {...props} css={root}>
			{children}
		</div>
	);
}

export default Menu;
export { LinkItem, ButtonItem };
