import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';

const domains: string[] = [
	'https://gnmtouchpoint--dev1--c.cs88.visual.force.com',
	'https://gnmtouchpoint--c.eu31.visual.force.com',
];

const isSalesforceDomain = (domain: string) =>
	domains.find((element) => element === domain);

const isInCsrMode = () => window.location !== window.parent.location;

const useCsrDetails = () => {
	const [csrUsername, setCsrUsername] = useState('');

	function checkForParentMessage(event: {
		origin: string;
		data: SetStateAction<string>;
	}) {
		if (isSalesforceDomain(event.origin)) {
			setCsrUsername(event.data);
		}
	}

	useEffect(() => {
		window.addEventListener('message', checkForParentMessage);
		return () => window.removeEventListener('message', checkForParentMessage);
	}, []);
	return csrUsername;
};

export { isInCsrMode, useCsrDetails };
