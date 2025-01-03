import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';

const listItem = css`
	display: flex;
	align-items: flex-start;

	& > * + * {
		margin-left: ${space[2]}px;
	}
`;
const list = css`
	& > * + * {
		margin-top: ${space[4]}px;
	}
`;
const setColor = (color: string) => {
	return css`
		& > svg > circle {
			fill: ${color};
		}
	`;
};

type BulletPointedListItemProps = {
	item: string;
	cssOverrides?: SerializedStyles;
};
type BulletPointedListProps = {
	items: string[];
	color?: string;
};

function SvgBullet() {
	return (
		<svg
			width="8"
			height="8"
			viewBox="0 0 8 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="4" cy="4" r="4" />
		</svg>
	);
}

function BulletPointedListItem({
	item,
	cssOverrides,
}: BulletPointedListItemProps) {
	return (
		<li css={listItem}>
			<div css={cssOverrides}>
				<SvgBullet />
			</div>
			<div>{item}</div>
		</li>
	);
}

function BulletPointedList({
	items,
	color = palette.brand[500], // default color
}: BulletPointedListProps) {
	return (
		<ul css={list}>
			{items.map((item) => (
				<BulletPointedListItem
					key={item}
					item={item}
					cssOverrides={setColor(color)}
				/>
			))}
		</ul>
	);
}

export default BulletPointedList;
