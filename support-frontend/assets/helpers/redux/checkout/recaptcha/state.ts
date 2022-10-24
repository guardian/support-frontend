export type RecaptchaState = {
	token: string;
	completed: boolean;
};

export const initialRecaptchaState = {
	token: '',
	completed: false,
};
