import { Layout } from '../../components/layout/layout';

type Props = {
	config: unknown;
};
export function Index({ config }: Props) {
	return <Layout id={'supporterPlusLandingPage'} config={config}></Layout>;
}
