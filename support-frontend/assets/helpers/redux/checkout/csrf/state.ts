export type CsrfState = {
	token: string | null | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition  -- window may be undefined in storybook
const initialCsrfState: CsrfState = window.guardian?.csrf ?? {
	token: null,
};
