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
type BulletPointedListItemProps = {
	item: string;
};
type BulletPointedListProps = {
	items: string[];
	cssOverrides?: SerializedStyles;
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
			<circle cx="4" cy="4" r="4" fill={`${palette.brand[500]}`} />
		</svg>
	);
}

function BulletPointedListItem({ item }: BulletPointedListItemProps) {
	return (
		<li css={listItem}>
			<div>
				<SvgBullet />
			</div>
			<div>{item}</div>
		</li>
	);
}

function BulletPointedList({ items, cssOverrides }: BulletPointedListProps) {
	return (
		<ul css={[list, cssOverrides]}>
			{items.map((item) => (
				<BulletPointedListItem key={item} item={item} />
			))}
		</ul>
	);
}

export default BulletPointedList;
