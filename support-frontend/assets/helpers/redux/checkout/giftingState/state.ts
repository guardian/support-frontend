import type { Title } from 'helpers/user/details';

type GiftingState = {
	title?: Title;
	firstName: string;
	lastName: string;
	email: string;
	giftMessage?: string;
	giftDeliveryDate?: string;
};

export const initialGiftingState: GiftingState = {
	firstName: '',
	lastName: '',
	email: '',
};
