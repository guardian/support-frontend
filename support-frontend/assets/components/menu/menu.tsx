import type { Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import styles from './menu.module.scss';

type itemProps = {
	children: Node;
	isSelected: boolean;
};

const Item = ({
	isSelected,
	children,
	el: El,
	...props
}: itemProps & {
	el: string;
}) => (
	<El {...props} className={styles.item} data-is-selected={isSelected}>
		{children}{' '}
		{isSelected && [
			<SvgCheckmark />,
			<span className="visually-hidden">Selected</span>,
		]}
	</El>
);

const LinkItem = ({
	children,
	...props
}: itemProps & {
	href: string;
}) => (
	<Item el="a" {...props}>
		{children}
	</Item>
);

const ButtonItem = ({ children, ...props }: itemProps) => (
	<Item el="button" {...props}>
		{children}
	</Item>
);

const Menu = ({ children, ...props }: { children: Node }) => (
	<div {...props} className={styles.root}>
		{children}
	</div>
);

export default Menu;
export { LinkItem, ButtonItem };
