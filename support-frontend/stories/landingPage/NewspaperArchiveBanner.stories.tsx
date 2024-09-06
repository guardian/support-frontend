import { NewspaperArchiveBanner } from 'pages/supporter-plus-landing/components/newspaperArchiveBanner';

export default {
	title: 'LandingPage/Newspaper Archive Banner',
	component: NewspaperArchiveBanner,
	// decorators: [withCenterAlignment, withSourceReset],
	parameters: {
		docs: {
			description: {
				component: `A product slice banner displaying the Newspaper archive benefit.`,
			},
		},
	},
};

function Template() {
	return <NewspaperArchiveBanner />;
}

export const Default = Template.bind({});
