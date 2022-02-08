import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { brand, brandAlt } from '@guardian/src-foundations/palette';
import { body } from '@guardian/src-foundations/typography';
import * as React from 'react';

export type ListItemText = {
	content: string;
	subText?: string;
};
type ListBulletSize = 'small' | 'large';
type ListBulletColour = 'light' | 'dark';
type ListProps = {
	items: ListItemText[];
	bulletSize?: ListBulletSize;
	bulletColour?: ListBulletColour;
	cssOverrides?: SerializedStyles;
};
type ListItemProps = {
	item: ListItemText;
	size: ListBulletSize;
	colour: ListBulletColour;
};
const list = css`
	${body.medium()};
	margin: 0 0 20px;

	${from.desktop} {
		margin: 0 0 30px;
	}
`;
const listItem = css`
	display: flex;
	flex-direction: row;
	align-items: flex-start;

	&:not(:last-of-type) {
		margin-bottom: ${space[4]}px;
	}
`;
const listItemBullet = css`
	display: inline-block;
	border-radius: 50%;
	/* Sit the bullet in the vertical centre of the first line */
	margin-top: calc((1.5em - ${space[3]}px) / 2);
`;
const listItemBulletLarge = css`
	width: ${space[3]}px;
	height: ${space[3]}px;

	${from.tablet} {
		margin-top: calc((1.5em - ${space[4]}px) / 2);
		width: ${space[4]}px;
		height: ${space[4]}px;
	}
`;
const listItemBulletSmall = css`
	width: ${space[3]}px;
	height: ${space[3]}px;
`;
const listItemBulletLight = css`
	background-color: ${brandAlt[400]};
`;
const listItemBulletDark = css`
	background-color: ${brand[400]};
`;
const listItemContent = css`
	margin-left: ${space[2]}px;
	max-width: 90%;
`;
const listItemMainText = css`
	display: block;
	font-weight: 700;
`;
const bulletColours: Record<ListBulletColour, SerializedStyles> = {
	light: listItemBulletLight,
	dark: listItemBulletDark,
};
const bulletSizes: Record<ListBulletSize, SerializedStyles> = {
	large: listItemBulletLarge,
	small: listItemBulletSmall,
};

function ListItem({ item, colour, size }: ListItemProps) {
	return (
		<li css={listItem}>
			<span css={[listItemBullet, bulletColours[colour], bulletSizes[size]]} />
			<span css={listItemContent}>{item.content}</span>
		</li>
	);
}

ListItem.defaultProps = {
	size: 'large',
	colour: 'light',
} as Partial<ListItemProps>;

function ListItemWithSubtext({ item, colour, size }: ListItemProps) {
	return (
		<li css={listItem}>
			<span css={[listItemBullet, bulletColours[colour], bulletSizes[size]]} />
			<div css={listItemContent}>
				<span css={listItemMainText}>{item.content}</span>
				{item.subText && <span>{item.subText}</span>}
			</div>
		</li>
	);
}

ListItemWithSubtext.defaultProps = {
	size: 'large',
	colour: 'light',
} as Partial<ListItemProps>;

function ListWith(ListItemComponent: React.FC<ListItemProps>) {
	function ListComponent(props: ListProps) {
		return (
			<ul css={[list, props.cssOverrides]}>
				{props.items.map((item) => (
					<ListItemComponent
						key={item.content}
						item={item}
						colour={props.bulletColour ?? 'light'}
						size={props.bulletSize ?? 'large'}
					/>
				))}
			</ul>
		);
	}

	ListComponent.defaultProps = {
		bulletSize: 'large',
		bulletColour: 'light',
		cssOverrides: '',
	};
	return ListComponent;
}

const List = ListWith(ListItem);
const ListWithSubText = ListWith(ListItemWithSubtext);
export { List, ListWithSubText };
