import { css } from '@emotion/react';

export const pageDefaultStyles = css`
	html,
	dialog {
		font-family: 'GuardianTextEgyptian', Georgia, serif;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
	}

	body {
		line-height: 1.5;
	}

	strong {
		font-weight: bolder;
	}

	/*
Disable forms pre hydration
*/
	[data-not-hydrated] {
		input,
		button {
			pointer-events: none;
		}
	}
`;
