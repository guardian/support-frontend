import type { PageScaffoldProps } from 'components/page/pageScaffold';
import { PageScaffold } from 'components/page/pageScaffold';

export default {
	title: 'Core/PageScaffold',
	component: PageScaffold,
	parameters: {
		docs: {
			description: {
				component:
					'A scaffold for pages on the site. It applies a CSS reset, ensures anchor links are scrolled to based on the URL hash, and renders the supplied header and footer and the CSR mode banner',
			},
		},
	},
};

function Template(args: PageScaffoldProps) {
	return <PageScaffold id={args.id}>{args.children}</PageScaffold>;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	id: 'default-page',
	children: (
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ex
			justo, varius ut porttitor tristique, rhoncus quis dolor. Etiam risus
			nisi, cursus eget risus nec, placerat imperdiet felis. Praesent odio
			justo, lacinia sit amet lacinia ac, euismod id augue. Proin in vestibulum
			urna. Nulla congue tristique mollis. Nulla facilisi. Nullam fringilla,
			nulla et pellentesque dapibus, odio orci pulvinar sapien, in lacinia lorem
			justo vel nulla. Pellentesque ut turpis velit. Sed sollicitudin mi non
			libero ornare, non vehicula tortor semper. Nunc congue vitae arcu et
			pellentesque. Nulla sit amet magna nunc. Nam malesuada erat nulla, ut
			semper metus cursus vel.
		</p>
	),
};
