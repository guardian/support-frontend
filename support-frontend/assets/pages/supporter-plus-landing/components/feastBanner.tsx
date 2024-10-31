import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	space,
	textSans15,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Hide } from '@guardian/source/react-components';
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const feastBanner = css`
	${until.desktop} {
		margin: ${space[9]}px -10px 0;
		padding-bottom: 0;
	}
	${from.desktop} {
		margin-top: ${space[8]}px;
		border-radius: 12px;
		background-image: url(https://i.guim.co.uk/img/media/0229069c0c821b8be5675ab7d28e145732a85d8d/0_0_1529_645/1529.png?width=382&quality=75&s=2aa45339f9460a5948d5192dc720cb68);
		background-size: contain;
		background-position: right;
		background-repeat: no-repeat;
	}
	background-color: #1e3e72;
	padding: ${space[4]}px ${space[6]}px;
	text-align: left;
`;

const headlineText = css`
	${headlineBold20};
	${from.desktop} {
		${headlineBold24};
	}
	color: ${neutral[100]};
`;

const newBenefitPill = css`
	${until.desktop} {
		display: inline;
		margin-right: ${space[2]}px;
	}
	${from.desktop} {
		margin-bottom: ${space[1]}px;
	}
	vertical-align: text-top;
`;

const paragraph = css`
	${textSans15};
	${from.desktop} {
		${textSans17};
	}
	color: ${neutral[100]};
`;

const mobileImage = css`
	width: 100%;
	object-fit: contain;
	vertical-align: top;
`;

export function FeastBanner() {
	return (
		<div css={feastBanner}>
			<div
				css={css`
					${from.desktop} {
						max-width: 400px;
					}
				`}
			>
				<h2
					css={css`
						margin-bottom: ${space[3]}px;
					`}
				>
					<div css={newBenefitPill}>
						<NewBenefitPill />
					</div>
					<span css={headlineText}>
						Unlimited access to the Guardian Feast App
					</span>
				</h2>
				<p css={paragraph}>
					Make a feast out of anything with the Guardian’s new recipe app. Feast
					has thousands of recipes including quick and budget-friendly weeknight
					dinners, and showstopping weekend dishes – plus smart app features to
					make mealtimes inspiring.
				</p>
			</div>
			<Hide from="desktop">
				<img
					css={mobileImage}
					alt=""
					src="https://i.guim.co.uk/img/media/0229069c0c821b8be5675ab7d28e145732a85d8d/0_0_1529_645/1529.png?width=382&quality=75&s=2aa45339f9460a5948d5192dc720cb68"
				/>
			</Hide>
		</div>
	);
}
