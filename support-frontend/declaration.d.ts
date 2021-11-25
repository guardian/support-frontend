declare module '*.scss';

declare module '*.png' {
	const content: string;
	export default content;
}

declare module '*.svg' {
	const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	export default content;
}

declare module 'ophan' {
	export const init: () => void;
	export const record: (...args: unknown[]) => void;
	export const sendInitialEvent: (...args: unknown[]) => void;
	export const viewId: string;
}
