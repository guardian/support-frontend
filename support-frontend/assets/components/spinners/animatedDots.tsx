// ----- Imports ----- //
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations';
import React from 'react';

// ----- Component ----- //

type PropTypes = {
	appearance: 'light' | 'medium' | 'dark';
};

export default function AnimatedDots({ appearance }: PropTypes): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={styles.bounce} data-appearance={appearance} data-bounce="1" />
			<div css={styles.bounce} data-appearance={appearance} data-bounce="2" />
			<div css={styles.bounce} data-appearance={appearance} data-bounce="3" />
		</div>
	);
}

// ---- Styles ---- //

const styles = {
	container: css`
		margin: 10px auto 0;
		width: 70px;
		text-align: center;
	`,
	bounce: css`
		width: 18px;
		height: 18px;
		border-radius: 100%;
		display: inline-block;
		animation: sk-bouncedelay 1.4s infinite ease-in-out both;

		&[data-appearance='light'] {
			background-color: ${neutral[100]};
		}

		&[data-appearance='medium'] {
			background-color: ${neutral[60]};
		}

		&[data-appearance='dark'] {
			background-color: ${neutral[46]};
		}

		&[data-bounce='1'] {
			animation-delay: -0.32s;
		}
		&[data-bounce='2'] {
			animation-delay: -0.16s;
		}
		&[data-bounce='3'] {
			animation-delay: -0.00s;
		}

	@keyframes sk-bouncedelay {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}
}
	`,
};
