export type RecaptchaState = {
	token: string;
	completed: boolean;
};

export const initialState = {
	token: '',
	completed: false,
};
