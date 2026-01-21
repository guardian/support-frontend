// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold34,
	palette,
	textEgyptian17,
	textSans17,
	titlepiece42,
	titlepiece50,
	until,
} from '@guardian/source/foundations';

export const ausMomentMapPageStyles = css`
	body {
		width: 100%;
		max-width: 100vw;
		left: 0;
		top: 0;
		overflow-x: hidden;
		margin: 0;
		padding: 0;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
	}

	.map-page,
	.map-page * {
		box-sizing: content-box;
	}

	.map-page {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		height: 100vh;
		${from.desktop} {
			overflow-x: hidden;
		}
	}

	#header-wrapper {
		display: flex;
		flex-shrink: 0;
		width: 100%;
		max-width: 100vw;
		border: 0;
		background-color: ${palette.brand[400]};
		box-sizing: border-box;
		padding: 12px 5%;
		${until.tablet} {
			padding: 4px 2%;
		}
	}

	#header {
		${headlineBold34}
		font-size: 36px;
		line-height: 1.5;
		color: ${palette.neutral[93]};
		-webkit-font-smoothing: antialiased;
		${until.tablet} {
			display: none;
		}
		${until.desktop} {
			font-size: 30px;
			top: 20px;
		}
	}

	.header-cta-text-full {
		display: none;
		${from.tablet} {
			display: block;
		}
	}

	.header-cta-text-short {
		display: block;
		${from.tablet} {
			display: none;
		}
	}

	.testimonial-cta-header {
		padding: 2px;
		background-color: ${palette.brandAlt[400]};
		box-shadow: 2px 0 0 ${palette.brandAlt[400]},
			-2px 0 0 ${palette.brandAlt[400]};
	}

	.testimonial-cta-primary-link-button {
		margin-top: 16px;
	}

	.testimonial-cta-secondary-link-button {
		margin-top: 16px;
	}

	.button-cta-secondary {
		background-color: ${palette.brand[400]};
		margin-top: 16px;
		padding: 8px 20px;

		&:hover {
			background-color: #041f4a;
		}
	}

	.logo {
		margin-left: auto;
		width: 110px;

		${from.tablet} {
			width: 240px;
		}

		${from.desktop} {
			width: 295px;
		}

		svg {
			display: block;
		}
	}

	.map {
		${until.desktop} {
			width: 100%;
		}
	}

	.clone {
		visibility: hidden;
	}

	.map.sticky {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		text-align: center;
		z-index: 500 !important;
	}

	.map.sticky .map-background {
		background-color: ${palette.neutral[100]};
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 0;
	}

	.map.sticky .svg-wrapper {
		top: 0;
		width: 35%;
		overflow: hidden;
	}

	.map.sticky .territory-label-full {
		display: none;
	}

	.map.sticky .territory-label-abbr {
		display: none;
		${from.tablet} {
			display: block;
		}
	}

	.svg-wrapper {
		display: inline-block;
		position: relative;
		width: 85%;
		padding-bottom: 80%;
		vertical-align: middle;
		overflow: hidden;
		box-sizing: border-box;
	}

	.svg-content {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.territory {
		${from.desktop} {
			cursor: pointer;

			&:hover .territory-landmass {
				color: ${palette.brandAlt[400]};
			}

			&:hover .territory-label-on-landmass {
				color: ${palette.neutral[20]};
			}
		}
	}

	.territory .territory-landmass {
		color: ${palette.neutral[20]};
	}

	.territory .territory-label {
		color: ${palette.neutral[7]};
	}

	.territory .territory-label-on-landmass {
		color: ${palette.neutral[100]};
	}

	.territory .territory-label-full {
		display: none;

		${from.tablet} {
			display: inline-block;
		}
	}

	.territory .territory-label-abbr {
		${from.tablet} {
			display: none;
		}
	}

	.territory-selected .territory-landmass {
		color: ${palette.brandAlt[400]};
	}

	.territory-selected .territory-label-on-landmass {
		color: ${palette.neutral[7]};
	}

	h2.blurb,
	h2.selected-territory {
		${titlepiece42};
		font-size: 3rem;
		text-align: left;
		color: ${palette.neutral[7]};
		line-height: 100%;
	}

	h2.blurb {
		${until.tablet} {
			margin-top: 1vh;
		}
		${until.desktop} {
			margin-top: 3vh;
		}
		${from.desktop} {
			margin-top: 0;
		}
	}

	h2.blurb-slim {
		font-size: 38px;
		margin-top: 30px;
	}

	p.blurb {
		${textEgyptian17}
		text-align: left;
		color: ${palette.neutral[20]};
		margin-bottom: 20px;
		margin-top: 10px;
	}

	.supporters-total {
		${titlepiece42}
		color: ${palette.neutral[7]};
	}

	.supporters-total-caption {
		${textSans17}
	}

	.social-links {
		position: relative;
		margin: 3em auto 0;
		display: block;
		float: none;
		width: 100%;
		bottom: 10px;
		border-top: 1px solid ${palette.neutral[86]};
		box-sizing: border-box;
		padding-top: 2px;
	}

	.social-link {
		cursor: pointer;
		padding: 2px;
	}

	.social-link:hover > circle:first-child {
		fill: ${palette.neutral[86]};
	}

	.main {
		flex-grow: 1;
		align-items: center;
		display: flex;
		flex-shrink: 0;
		position: relative;
		width: 100%;
		max-width: 100vw;
		box-sizing: border-box;
		${until.desktop} {
			align-items: flex-start;
			align-content: flex-start;
			flex-direction: column;
		}
	}

	.left {
		left: 0;
		width: 100%;
		display: inline-block;
		text-align: center;
		box-sizing: border-box;
		padding-top: 1.5em;
		${from.desktop} {
			height: 100%;
			max-width: 50vw;
			overflow-x: hidden;
		}
	}

	.left-padded-inner {
		display: none;
		padding-left: 10%;
		padding-right: 10%;
	}

	.right {
		right: 0;
		height: 100%;
		display: inline-block;
		text-align: left;
		width: 45%;
		overflow: hidden;
		padding: 5% 5% 5% 0;
		box-sizing: border-box;
		${until.desktop} {
			width: 100%;
			padding: 10vh 0 0 0;
		}
	}

	.testimonials-overlay {
		${from.desktop} {
			background-color: ${palette.neutral[100]};
			overflow: hidden;
			position: absolute;
			right: -59vw;
			width: 59vw;
			top: 0;
			height: 100%;
			z-index: 200;
		}
	}

	.close-button {
		z-index: 300;
		cursor: pointer;
		position: absolute;
		right: 10%;
		top: 5%;
		${until.desktop} {
			display: none;
		}
	}

	.close-button > path {
		fill: ${palette.neutral[7]};
	}

	.close-button > rect {
		stroke: ${palette.neutral[7]};
		fill: ${palette.neutral[100]};
	}

	.close-button:hover > rect {
		fill: #ededed;
	}

	span.selected-territory {
		background-color: #ededed;
		color: #052962;
		display: inline-block;
		padding-bottom: 10px;
		padding-left: 5px;
		padding-right: 5px;
		vertical-align: center;
		top: -10px;
		left: 0;
	}

	.blurb-wrapper {
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		padding: 0 12px;
		${from.tablet} {
			padding: 0 34px;
		}
	}

	.testimonials-wrapper {
		border-top: 1px solid ${palette.neutral[93]};
		width: 90%;
		display: flex;
		flex-shrink: 0;
	}

	.testimonials-container {
		padding-bottom: 48px;
		max-height: 100%;
		position: relative;
		${from.desktop} {
			overflow-y: scroll;
		}
	}

	.testimonials-container-header.sticky {
		${until.desktop} {
			position: fixed;
			top: 0;
			width: 100%;
			background-color: ${palette.neutral[100]};
			z-index: 600;
		}
	}

	.testimonials-container-header {
		top: 0;
		background-color: ${palette.neutral[100]};
		font-weight: bold;
		color: ${palette.neutral[7]};
		margin-top: 0;
		padding: 10px 0 0 12px;
		font-size: 20px;

		${from.tablet} {
			${textEgyptian17}
			padding-top: 10px;
			padding-left: 34px;
			text-align: left;
			font-size: 28px;
		}

		${from.desktop} {
			${titlepiece50}
			padding: 35px 12px 4px 0;
			line-height: 1;
		}
	}

	.testimonials-for-territory:last-child {
		${from.desktop} {
			padding-bottom: 500px;
		}
	}

	.testimonials-for-territory:first-child {
		margin-top: 0;
	}

	.testimonials-for-territory {
		${until.desktop} {
			margin-top: 50px;
		}
	}

	.testimonials-for-territory-header {
		padding: 12px 12px 4px 12px;
		border-bottom: 2px solid #052962;
		line-height: 1;
		background-color: ${palette.neutral[100]};

		h2 {
			margin: 0 0 0 12px;
			${textEgyptian17}
			font-size: 24px;
			font-weight: 800;

			${from.desktop} {
				margin: 0;
				${titlepiece42}
				font-size: 48px;
				padding: 0 5px 10px 5px;
			}
		}

		${from.tablet} {
			padding: 12px 34px 4px 34px;
		}

		${from.desktop} {
			padding: 12px 0 20px 0;
			border-bottom: none;
			position: sticky;
			top: 0;
		}
	}

	.testimonials-for-territory-header.sticky {
		width: 100%;
		background-color: ${palette.neutral[100]};
		position: fixed;
	}

	.testimonials-for-territory-header-text-and-icon-container {
		display: flex;
		flex-shrink: 0;
		align-items: center;

		svg {
			${from.desktop} {
				display: none;
			}
		}
	}

	.testimonials-columns-container {
		padding: 0 12px;
		display: flex;
		flex-shrink: 0;
		flex-direction: column;

		${from.tablet} {
			flex-direction: row;
			padding: 0 34px;
		}

		${from.desktop} {
			flex-direction: row;
			margin-right: 10%;
			padding: 0;
		}
	}

	.testimonials-container-header br {
		${until.desktop} {
			display: none;
		}
	}

	.testimonials-first-column {
		width: 100%;
		${from.tablet} {
			width: 50%;
		}
	}

	.testimonials-first-column > .testimonial-component:nth-child(even) {
		background-color: ${palette.neutral[97]};
	}

	.testimonials-second-column {
		width: 100%;
		${from.tablet} {
			width: 50%;
		}

		${from.tablet} {
			margin-left: 12px;
		}
	}

	.testimonials-second-column > .testimonial-component:nth-child(odd) {
		background-color: ${palette.neutral[97]};
	}

	.testimonial-component {
		${textEgyptian17}
		line-height: 1.5;
		margin-top: 12px;
		border: 1px solid ${palette.neutral[86]};
		padding: 12px;
	}

	.testimonial-component-details {
		margin-top: 4px;
		font-weight: 800;
	}

	.testimonial-cta {
		${textEgyptian17}
		font-size: 16px;
		line-height: 1.5;
		margin-top: 12px;
		padding: 12px;
		border: 1px solid ${palette.brand[400]};
		background-color: ${palette.neutral[93]};

		h3 {
			${headlineBold20}
			margin: 0;
			font-weight: 800;
		}

		p {
			margin: 4px 0 0 0;
		}
	}

	.testimonial-cta-secondary {
		${from.tablet} {
			display: none;
		}
	}

	.testimonials-read-more-button-container {
		margin-top: 12px;
		margin-left: 12px;
	}

	.padded-multiline {
		${from.desktop} {
			line-height: 1.2;
			margin-left: -0.25rem !important;

			span {
				background-color: ${palette.brandAlt[400]};
				color: ${palette.neutral[20]};
				display: inline;
				padding: 0.25rem;
				box-decoration-break: clone;
				-webkit-box-decoration-break: clone;
			}
		}
	}

	.midpoint-ctas {
		margin: 38px 12px 0 12px;
		${from.tablet} {
			display: none;
		}
	}
`;
