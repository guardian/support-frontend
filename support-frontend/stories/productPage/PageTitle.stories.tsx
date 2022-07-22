import CentredContainer from 'components/containers/centredContainer';
import PageTitle from 'components/page/pageTitle';
import { Hero } from './Hero.stories';

export default {
	title: 'Product Page/Title',
	component: PageTitle,
	argTypes: {
		theme: {
			control: {
				type: 'select',
				options: ['showcase', 'digital', 'weekly', 'paper'],
			},
		},
	},
};

export function Title(args: {
	theme: 'showcase' | 'digital' | 'weekly' | 'paper';
}): JSX.Element {
	return (
		<PageTitle title="Page Title" theme={args.theme}>
			<CentredContainer>
				<Hero />
			</CentredContainer>
		</PageTitle>
	);
}

Title.args = {
	theme: 'weekly',
};
