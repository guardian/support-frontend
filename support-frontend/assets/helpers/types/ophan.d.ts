interface Ophan {
	init: () => void;
}

declare module 'ophan' {
	const ophan: Ophan;
	export default ophan;
}
