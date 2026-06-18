export const loadPayPalRecurring = (): Promise<void> => {
	return new Promise((resolve) => {
		const script: HTMLScriptElement = document.createElement('script');
		script.onload = () => resolve();
		script.src = 'https://www.paypalobjects.com/api/checkout.js';

		document.head.appendChild(script);
	});
};
