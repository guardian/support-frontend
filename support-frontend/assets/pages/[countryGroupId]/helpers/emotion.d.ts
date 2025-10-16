import '@emotion/react';

declare module '@emotion/react' {
	type Organisation = 'guardian' | 'observer';
	export interface Theme {
		organisation: Organisation;
	}
}
