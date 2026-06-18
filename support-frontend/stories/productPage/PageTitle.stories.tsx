import { PageTitle } from 'components/page/pageTitle';

export default {
	title: 'Product Page/Title',
	component: PageTitle,
	argTypes: {
		theme: {
			control: {
				type: 'select',
				options: ['digital', 'weekly', 'paper'],
			},
		},
	},
};

export function Title(args: {
	theme: 'digital' | 'weekly' | 'paper';
}): JSX.Element {
	return (
		<PageTitle title="Page Title" theme={args.theme}>
			<></>
		</PageTitle>
	);
}

Title.args = {
	theme: 'weekly',
};
