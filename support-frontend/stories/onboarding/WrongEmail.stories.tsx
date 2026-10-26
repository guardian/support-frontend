import { WrongEmail } from 'components/onboarding/sections/wrongEmail';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/WrongEmail',
	component: WrongEmail,
	decorators: [withSourceReset],
	parameters: {
		layout: 'fullscreen',
	},
};

export const Default = {};
