export type CsrfState = {
	token: string | null | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- to be removed
export const initialCsrfState: CsrfState = window.guardian?.csrf ?? {
	token: null,
};
