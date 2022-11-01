export type RecaptchaState = {
	token: string;
	completed: boolean;
	errors: string[];
};

export const initialState: RecaptchaState = {
	token: '',
	completed: false,
	errors: [],
};
