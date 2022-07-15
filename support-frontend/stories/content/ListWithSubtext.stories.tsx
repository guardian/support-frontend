import type { ListItemText } from 'components/list/list';
import { ListWithSubText as ListComponent } from 'components/list/list';

export default {
	title: 'Content/List With Sub Text',
	component: ListComponent,
	argTypes: {
		bulletColour: { control: { type: 'radio', options: ['light', 'dark'] } },
		bulletSize: { control: { type: 'radio', options: ['small', 'large'] } },
	},
};

export function ListWithSubText(args: {
	bulletSize: 'small' | 'large';
	bulletColour: 'light' | 'dark';
	items: ListItemText[];
}): JSX.Element {
	return (
		<ListComponent
			bulletColour={args.bulletColour}
			bulletSize={args.bulletSize}
			items={args.items}
		/>
	);
}

ListWithSubText.args = {
	bulletColour: 'light',
	bulletSize: 'small',
	items: [
		{
			content: 'This is a list',
			subText: 'With optional sub text',
		},
		{
			content: "It's useful in several situations",
			subText: 'Like when you want to add extra information for each list item',
		},
		{
			content: "But you don't have to use it",
		},
	],
};
