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

type SvgBulletProps = {
	color?: string;
};
type BulletPointedListItemProps = {
	item: string;
	color?: string;
};
type BulletPointedListProps = {
	items: string[];
	color?: string;
};

function SvgBullet({ color = palette.brand[500] }: SvgBulletProps) {
	return (
		<svg
			width="8"
			height="8"
			viewBox="0 0 8 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="4" cy="4" r="4" fill={`${color}`} />
		</svg>
	);
}

function BulletPointedListItem({ item, color }: BulletPointedListItemProps) {
	return (
		<li css={listItem}>
			<div>
				<SvgBullet color={color} />
			</div>
			<div>{item}</div>
		</li>
	);
}

function BulletPointedList({ items, color }: BulletPointedListProps) {
	return (
		<ul css={list}>
			{items.map((item) => (
				<BulletPointedListItem key={item} item={item} color={color} />
			))}
		</ul>
	);
}

export default BulletPointedList;
