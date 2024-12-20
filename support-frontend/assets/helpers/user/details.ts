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
export type Title = keyof typeof titles;
