import type { ReactNode } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import moduleStyles from './menu.module.scss';

const styles = moduleStyles as { item: string; root: string };

type ItemProps = {
	children: ReactNode;
	isSelected: boolean;
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
}: ItemProps & {
	href: string;
	onClick: () => void;
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
	style: Record<string, string | number>;
}): JSX.Element {
	return (
		<div {...props} className={styles.root}>
			{children}
		</div>
	);
}

export default Menu;
export { LinkItem, ButtonItem };
