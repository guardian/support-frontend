import type { IsoCountry } from 'helpers/internationalisation/country';

export type FormPersonalFields = {
	firstName: string;
	lastName: string;
	email: string;
};

export const extractPersonalDataFromForm = (
	formData: FormData,
): FormPersonalFields => ({
	firstName: formData.get('firstName') as string,
	lastName: formData.get('lastName') as string,
	email: formData.get('email') as string,
});

export type FormAddressFields = {
	billingAddress: {
		lineOne?: string | null;
		lineTwo?: string | null;
		city?: string | null;
		state?: string | null;
		postCode?: string | null;
		country: IsoCountry;
	};
	deliveryAddress?: {
		lineOne?: string | null;
		lineTwo?: string | null;
		city?: string | null;
		state?: string | null;
		postCode?: string | null;
		country: IsoCountry;
	};
};

export const extractDeliverableAddressDataFromForm = (
	formData: FormData,
): FormAddressFields => {
	const deliveryAddress = {
		lineOne: formData.get('delivery-lineOne') as string,
		lineTwo: formData.get('delivery-lineTwo') as string,
		city: formData.get('delivery-city') as string,
		state: formData.get('delivery-stateProvince') as string,
		postCode: formData.get('delivery-postcode') as string,
		country: formData.get('delivery-country') as IsoCountry,
	};

	const billingAddressMatchesDelivery =
		formData.get('billingAddressMatchesDelivery') === 'yes';

	const billingAddress = !billingAddressMatchesDelivery
		? {
				lineOne: formData.get('billing-lineOne') as string,
				lineTwo: formData.get('billing-lineTwo') as string,
				city: formData.get('billing-city') as string,
				state: formData.get('billing-stateProvince') as string,
				postCode: formData.get('billing-postcode') as string,
				country: formData.get('billing-country') as IsoCountry,
		  }
		: deliveryAddress;

	return {
		deliveryAddress,
		billingAddress,
	};
};

export const extractNonDeliverableAddressDataFromForm = (
	formData: FormData,
): FormAddressFields => ({
	billingAddress: {
		state: formData.get('billing-state') as string,
		postCode: formData.get('billing-postcode') as string,
		country: formData.get('billing-country') as IsoCountry,
	},
	deliveryAddress: undefined,
});
