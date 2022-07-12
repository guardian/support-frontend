import BlockLabelComponent from 'components/blockLabel/blockLabel';

export default {
	title: 'Content/Block Label',
	component: BlockLabelComponent,
};

export function BlockLabel(args: { copy: string }): JSX.Element {
	return <BlockLabelComponent>{args.copy}</BlockLabelComponent>;
}

BlockLabel.args = {
	copy: 'Use this for stand-out labels on other content',
};
