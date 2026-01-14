import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import AnchorButton from '../../assets/components/button/anchorButton';

export default {
	title: 'Core/AnchorButton',
	component: AnchorButton,
	decorators: [withCenterAlignment],
};

export function AnchorButtonStory(): JSX.Element {
	return (
		<AnchorButton link="https://www.theguardian.com" ctaButtonText="Test" />
	);
}
