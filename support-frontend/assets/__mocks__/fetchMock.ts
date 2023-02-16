type ReturnValue = string | boolean;

export function mockFetch(returnValue: Record<string, ReturnValue>): void {
	window.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(returnValue),
		}),
	) as jest.Mock;
}
