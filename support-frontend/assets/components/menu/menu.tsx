import type { Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import styles from './menu.module.scss';

type itemProps = {
	children: Node;
	isSelected: boolean;
};

function Item({
	isSelected,
	children,
	el: El,
	...props
}: itemProps & {
	el: string;
}) {
	return (
		<El {...props} className={styles.item} data-is-selected={isSelected}>
			{children}{' '}
			{isSelected && [
				<SvgCheckmark />,
				<span className="visually-hidden">Selected</span>,
			]}
		</El>
	);
}

function LinkItem({
	children,
	...props
}: itemProps & {
	href: string;
}) {
	return (
		<Item el="a" {...props}>
			{children}
		</Item>
	);
}

function ButtonItem({ children, ...props }: itemProps) {
	return (
		<Item el="button" {...props}>
			{children}
		</Item>
	);
}

function Menu({ children, ...props }: { children: Node }) {
	return (
		<div {...props} className={styles.root}>
			{children}
		</div>
	);
}

export default Menu;
export { LinkItem, ButtonItem };
