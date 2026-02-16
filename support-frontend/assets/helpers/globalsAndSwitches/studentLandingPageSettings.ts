
interface Image {
    desktopUrl: string;
    tabletUrl: string;
    mobileUrl: string;
    altText: string;
}

interface Institution {
    name: string;
    acronym: string;
    logoUrl: string;
}

interface StudentLandingPageVariant {
    name: string;
    heading: string;
    subheading: string;
    image: Image;
    institution: Institution;
    promoCode: string[]; // ?? USE THIS TO ENSURE NO MIXING OF PROMOCODES?
}
export interface StudentLandingPageTest {
	name: string;
	status: 'Live' | 'Draft';
	regionId: 'AUDCountries' | 'NZDCountries'; // TODO: is this correct - should we hard code?
    variants: StudentLandingPageVariant[];
}