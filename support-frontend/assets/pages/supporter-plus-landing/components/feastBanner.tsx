import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const containerFeast = css`
	flex-basis: 100%; /* Share width & height of the banner with other components */
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	background-color: #1e3e72;
	padding: ${space[4]}px ${space[4]}px 0px ${space[4]}px;
	text-align: left;

	${from.desktop} {
		border-radius: ${space[3]}px 0 0 ${space[3]}px;
	}
`;

const headlineAndParagraph = css`
	margin-bottom: auto;
`;

const headlineText = css`
	color: ${neutral[100]};
	margin-bottom: ${space[3]}px;

	${headlineBold20};
	${from.desktop} {
		${headlineBold24};
	}

	& div {
		display: none;
		${from.desktop} {
			display: inline;
			margin-left: 1px;
		}
	}
`;

const paragraphText = css`
	${textSans15};
	${from.desktop} {
		${textSans17};
	}
	color: ${neutral[100]};
`;

const image = css`
	width: 100%;
	object-fit: contain;
	align-items: bottom;
`;

export function FeastBanner() {
	return (
		<div css={containerFeast}>
			<div css={headlineAndParagraph}>
				<h2 css={headlineText}>
					<>
						<NewBenefitPill />{' '}
					</>
					Unlimited access to the Guardian Feast App
				</h2>
				<p css={paragraphText}>
					Make a feast out of anything with the Guardian’s new recipe app. Feast
					has thousands of recipes including quick and budget-friendly weeknight
					dinners, and showstopping weekend dishes – plus smart app features to
					make mealtimes inspiring.
				</p>
			</div>
			<img
				css={image}
				alt=""
				src="https://i.guim.co.uk/img/media/0229069c0c821b8be5675ab7d28e145732a85d8d/0_0_1529_645/1000.png?width=1000&quality=75&s=d2881465ddca62054b9b8ba65682fff6"
			/>
		</div>
	);
}
