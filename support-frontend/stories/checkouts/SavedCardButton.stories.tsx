import type { SavedCardButtonProps } from 'components/savedCardButton/savedCardButton';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Saved Card Button',
	component: SavedCardButton,
	argTypes: { onClick: { action: 'clicked' } },
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: SavedCardButtonProps) {
	return <SavedCardButton {...args} />;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});
