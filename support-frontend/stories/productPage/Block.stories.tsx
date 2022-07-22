import CentredContainer from 'components/containers/centredContainer';
import BlockComponent from 'components/page/block';

export default {
	title: 'Product Page/Block',
	component: BlockComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					paddingTop: '100px',
				}}
			>
				<CentredContainer>
					<Story />
				</CentredContainer>
			</div>
		),
	],
};

export function Block(): JSX.Element {
	return (
		<BlockComponent>
			<section>
				<p>This is a container for text or other content</p>
			</section>
		</BlockComponent>
	);
}
