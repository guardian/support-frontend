import type { CountryGroupId } from '@modules/internationalisation/countryGroup';

interface Image {
	desktopUrl: string;
	tabletUrl: string;
	mobileUrl: string;
	altText: string;
}

export interface Institution {
	name: string;
	acronym: string;
	logoUrl: string;
}

export interface StudentLandingPageVariant {
	name: string;
	heading: string;
	subheading: string;
	image: Image;
	institution: Institution;
	promoCode: string[]; // ?? USE THIS TO ENSURE NO MIXING OF PROMOCODES?
}
interface Scheduler {
	start?: string; // ISO date "YYYY-MM-DD", inclusive
	end?: string; // ISO date "YYYY-MM-DD", inclusive
}

export interface StudentLandingPageTest {
	name: string;
	status: 'Live' | 'Draft';
	countryGroupId: CountryGroupId;
	variants: StudentLandingPageVariant[];
	scheduler?: Scheduler;
}
