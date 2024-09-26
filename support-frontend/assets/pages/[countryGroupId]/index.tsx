import { Layout } from '../../components/layout/layout';

type Props = {
	config: unknown;
};
export function Index({ config }: Props) {
	return (
		<Layout
			id={'supporterPlusLandingPage'}
			children={<h1>Hello</h1>}
			config={config}
		></Layout>
	);
}
