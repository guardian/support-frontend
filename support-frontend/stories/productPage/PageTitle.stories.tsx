import CentredContainer from 'components/containers/centredContainer';
import PageTitle from 'components/page/pageTitle';
import { Hero } from './Hero.stories';

export default {
	title: 'Product Page/Title',
	component: PageTitle,
};

export function Title(): JSX.Element {
	return (
		<PageTitle title="Page Title">
			<CentredContainer>
				<Hero />
			</CentredContainer>
		</PageTitle>
	);
}
