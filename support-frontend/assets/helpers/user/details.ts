export const titles: Record<string, string> = {
	Ms: 'Ms',
	Mr: 'Mr',
	Mrs: 'Mrs',
	Mx: 'Mx',
	Miss: 'Miss',
	Dr: 'Dr',
	Prof: 'Prof',
	Rev: 'Rev',
};

// TODO: Fix this type. Currently Title is just string.
export type Title = keyof typeof titles;
