import type { ListItemText } from 'components/list/list';
import { List as ListComponent } from 'components/list/list';

export default {
	title: 'Content/List',
	component: ListComponent,
};

export function List(args: { items: ListItemText[] }): JSX.Element {
	return <ListComponent items={args.items} />;
}

List.args = {
	items: [
		{
			content: 'This is a list',
		},
		{
			content:
				"You can put items in it, even if they're long sentences that will definitely overflow and wrap on mobile",
		},
		{
			content: "It's very nice",
		},
	],
};
