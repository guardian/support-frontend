import { css } from '@emotion/core';
import { headline } from '@guardian/src-foundations/typography';
import { brandAltBackground } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
const allowsAnimation = '@media (prefers-reduced-motion: no-preference)';
export const giftTag = css`
	display: flex;
	flex-direction: column;
	max-width: 100%;
	${from.tablet} {
		max-width: 365px;
	}
	${from.desktop} {
		max-width: 510px;
	}
`;
export const toFromLines = css`
	display: inline-flex;
	justify-content: flex-start;
`;
export const toYouTyping = css`
	animation: none;
	-webkit-animation: none;
	letter-spacing: 0.01em; /* Adjust as needed */
	margin-left: ${space[2]}px;

	color: ${brandAltBackground.primary};
	${headline.small({
		fontWeight: 'bold',
	})};

	${from.mobileLandscape} {
		${headline.medium({
			fontWeight: 'bold',
		})};
	}

	${from.desktop} {
		${headline.large({
			fontWeight: 'bold',
		})};
		margin-left: 8px;
	}

	${allowsAnimation} {
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		white-space: nowrap; /* Keeps the content on a single line */
		animation: typing-to 0.7s steps(3, end);

		/* This is to make it work on iPhones */
		-webkit-animation-name: typing-to;
		-webkit-animation-duration: 0.7s;
		-webkit-animation-timing-function: steps(3, end);

		@keyframes typing-to {
			from {
				width: 0;
			}
			to {
				width: 17.5%;
			}
		}

		@-webkit-keyframes typing-to {
			from {
				width: 0;
			}
			to {
				width: 17.5%;
			}
		}

		animation-fill-mode: both;
		-webkit-animation-fill-mode: both;
		animation-delay: 1s;
		-webkit-animation-delay: 1s;

		${from.mobileMedium} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 15%;
				}
			}
		}

		${from.mobileLandscape} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 14%;
				}
			}
		}

		${from.phablet} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 10%;
				}
			}
		}

		${from.tablet} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 17%;
				}
			}
		}

		${from.desktop} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 16%;
				}
			}
		}

		${from.leftCol} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 18.5%;
				}
			}
		}

		${from.wide} {
			@keyframes typing-to {
				from {
					width: 0;
				}
				to {
					width: 16.5%;
				}
			}
		}
	}
`;
export const toYouCursor = css`
	animation: none;
	-webkit-animation: none;
	border-right: none;
	-webkit-border-right: none;

	${allowsAnimation} {
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		border-right: 1px solid white; /* The typwriter cursor */
		white-space: nowrap; /* Keeps the content on a single line */
		animation: blink-caret-to 0.7s steps(3, jump-both);

		/* This is to make it work on iPhones */
		-webkit-animation-name: blink-caret-to;
		-webkit-animation-duration: 0.7s;
		-webkit-animation-timing-function: steps(3, jump-both);
		animation-fill-mode: both;
		-webkit-animation-fill-mode: both;
		animation-delay: 1s;
		-webkit-animation-delay: 1s;

		animation-fill-mode: both;
		-webkit-animation-fill-mode: both;
		animation-delay: 1s;
		-webkit-animation-delay: 1s;

		@keyframes blink-caret-to {
			from,
			to {
				border-color: transparent;
			}
			50% {
				border-color: white;
			}
		}
	}
`;
export const fromMeTyping = css`
	animation: none;
	-webkit-animation: none;
	letter-spacing: 0.01em; /* Adjust as needed */
	margin-left: ${space[2]}px;

	color: ${brandAltBackground.primary};
	${headline.small({
		fontWeight: 'bold',
	})};

	${from.mobileLandscape} {
		${headline.medium({
			fontWeight: 'bold',
		})};
	}

	${from.desktop} {
		${headline.large({
			fontWeight: 'bold',
		})};
		margin-left: 8px;
	}

	${allowsAnimation} {
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		white-space: nowrap; /* Keeps the content on a single line */
		animation: typing-from 0.5s steps(2, end);

		/* This is to make it work on iPhones */
		-webkit-animation-name: typing-from;
		-webkit-animation-duration: 0.5s;
		-webkit-animation-timing-function: steps(2, end);

		animation-fill-mode: both;
		-webkit-animation-fill-mode: both;
		animation-delay: 2.4s;
		-webkit-animation-delay: 2.4s;

		@keyframes typing-from {
			from {
				width: 0;
			}
			to {
				width: 14%;
			}
		}

		@-webkit-keyframes typing-from {
			from {
				width: 0;
			}
			to {
				width: 14%;
			}
		}

		${from.mobileMedium} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				to {
					width: 12%;
				}
			}
		}

		${from.mobileLandscape} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				// Looks like a repetition but seems only to work at this size if specified
				to {
					width: 12%;
				}
			}
		}

		${from.tablet} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				to {
					width: 14%;
				}
			}
		}

		${from.desktop} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				to {
					width: 13%;
				}
			}
		}

		${from.leftCol} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				to {
					width: 15.5%;
				}
			}
		}

		${from.wide} {
			@keyframes typing-from {
				from {
					width: 0;
				}
				to {
					width: 13.25%;
				}
			}
		}
	}
`;
export const fromMeCursor = css`
	animation: none;
	-webkit-animation: none;
	border-right: none;
	-webkit-border-right: none;

	${allowsAnimation} {
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		border-right: 1px solid white; /* The typwriter cursor */
		animation: blink-caret-from 0.7s steps(2, jump-end);

		/* This is to make it work on iPhones */
		-webkit-animation-name: blink-caret-from;
		-webkit-animation-duration: 0.7s;
		-webkit-animation-timing-function: steps(2, jump-end);

		animation-fill-mode: both;
		-webkit-animation-fill-mode: both;
		animation-delay: 2.4s;
		-webkit-animation-delay: 2.4s;

		@keyframes blink-caret-from {
			from,
			to {
				border-color: transparent;
			}
			50% {
				border-color: white;
			}
		}
	}
`;
export const heroHeading = css`
	display: inline-flex;
	${headline.small({
		fontWeight: 'bold',
	})};
	/* max-width: 100%; */
	letter-spacing: 0.01em;

	${from.mobileLandscape} {
		${headline.medium({
			fontWeight: 'bold',
		})};
	}

	${from.desktop} {
		${headline.large({
			fontWeight: 'bold',
		})};
	}

	${from.leftCol} {
		margin-top: 0;
	}
`;
