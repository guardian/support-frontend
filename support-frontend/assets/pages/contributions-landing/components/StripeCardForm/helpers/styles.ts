import { css } from '@emotion/react';

export const styles = {
	stripeField: {
		base: {
			fontFamily:
				"'GuardianTextSans', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
			'::placeholder': {
				color: '#999999',
			},
			fontSize: '17px',
			lineHeight: '1.5',
		},
	},
	zipCodeContainer: css`
		margin-top: 0.65rem;
	`,
};
