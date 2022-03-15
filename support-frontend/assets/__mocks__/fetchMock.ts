export function mockFetch(returnValue: Record<string, any>): void {
	window.fetch = () =>
		// @ts-expect-error -- Simple fetch mock
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(returnValue),
		});
}
