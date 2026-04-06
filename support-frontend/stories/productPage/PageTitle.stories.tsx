import CentredContainer from 'components/containers/centredContainer';
import HeroSkeleton from 'components/page/hero';
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
			<CentredContainer>
				<HeroSkeleton />
			</CentredContainer>
		</PageTitle>
	);
}

Title.args = {
	theme: 'weekly',
};
