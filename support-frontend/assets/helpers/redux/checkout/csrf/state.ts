export type CsrfState = {
	token: string | null | undefined;
};

export const initialCsrfState: CsrfState = window.guardian.csrf ?? {
	token: null,
};
