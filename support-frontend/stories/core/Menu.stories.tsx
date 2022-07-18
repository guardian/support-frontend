import MenuComponent, { ButtonItem, LinkItem } from 'components/menu/menu';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Core/Menu',
	component: MenuComponent,
	decorators: [withCenterAlignment],
};

export function Menu(): JSX.Element {
	return (
		<MenuComponent>
			<ButtonItem>This is a menu</ButtonItem>
			<ButtonItem>Feed it with items</ButtonItem>
			<ButtonItem>To make the menu beasts happy</ButtonItem>
			<ButtonItem isSelected>You can make an item look selected</ButtonItem>
			<LinkItem href="#">Use LinkItem for links</LinkItem>
		</MenuComponent>
	);
}
