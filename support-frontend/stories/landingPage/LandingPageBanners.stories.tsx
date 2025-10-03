import { LandingPageBanners } from 'pages/supporter-plus-landing/components/landingPageBanners';

export default {
	title: 'LandingPage/Banners',
	component: LandingPageBanners,
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
	return <LandingPageBanners />;
}

export const Default = Template.bind({});
