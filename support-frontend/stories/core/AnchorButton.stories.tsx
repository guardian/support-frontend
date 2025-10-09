import AnchorButton from '../../assets/components/button/anchorButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Core/AnchorButton',
	component: AnchorButton,
	decorators: [withCenterAlignment],
};

export function AnchorButtonStory(): JSX.Element {
	return <AnchorButton href="https://www.theguardian.com">Test</AnchorButton>;
}
