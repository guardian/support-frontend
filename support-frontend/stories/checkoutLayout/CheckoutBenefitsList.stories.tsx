import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsContainer';
import CheckoutBenefitsListComponent from 'components/checkoutBenefits/checkoutBenefitsList';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

export default {
	title: 'Checkout Layout/Benefits List',
	component: CheckoutBenefitsListComponent,
	decorators: [(Story: React.FC): JSX.Element => <Story />],
};

export function CheckoutBenefitsList(args: {
	titleCopy: string;
	btnCopy: string;
	showBenefitsMessaging: boolean;
	paragraph: string;
	desktopGridId: string;
	// checkListData: CheckListData[];
	handleBtnClick: () => void;
}): JSX.Element {
	return (
		<CheckoutBenefitsListComponent
			titleCopy={args.titleCopy}
			btnCopy={args.btnCopy}
			showBenefitsMessaging={args.showBenefitsMessaging}
			paragraph={args.paragraph}
			desktopGridId={args.desktopGridId}
			checkListData={checkListData(GBPCountries, args.showBenefitsMessaging)}
			handleBtnClick={args.handleBtnClick}
		/>
	);
}

CheckoutBenefitsList.args = {
	titleCopy: "You've unlocked exclusive extras",
	btnCopy: 'Change to £20 per month',
	showBenefitsMessaging: true,
	paragraph: 'Thank you for choosing to give £20 or more each month.',
	desktopGridId: 'benefitsPackshotBulletsDesktopUK',
	// checkListData: checkListData(GBPCountries, true),
	handleBtnClick: () => undefined,
};
