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

const newspaperArchiveBanner = css`
	${until.desktop} {
		margin: ${space[9]}px -10px 0;
		padding-bottom: 0;
	}
	${from.desktop} {
		margin-top: ${space[8]}px;
		border-radius: 12px;
		background-image: url(https://i.guim.co.uk/img/media/28125ed36669d6e27356d28044ba5db19cde11d1/0_0_3747_1007/2000.png?width=1300&quality=75&s=4d14643a2ebe76812931d8028f2e2150);
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

export function NewspaperArchiveBanner() {
	return (
		<div css={newspaperArchiveBanner}>
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
						The Guardian archives: discover 200 years of journalism
					</span>
				</h2>
				<p css={paragraph}>
					Lorem Ipsum, sometimes referred to as 'lipsum', is the placeholder
					text used in design when creating content. It helps designers plan out
					where the content will sit, without needing to wait for the content to
					be written and approved
				</p>
			</div>
			<Hide from="desktop">
				<img
					css={mobileImage}
					alt=""
					src="https://i.guim.co.uk/img/media/6a10c564d225dc23d3a24098a033464769740f01/0_0_1781_868/1000.png?width=1000&quality=75&s=16aec938fdd59f7a23f14fa7131fe554"
				/>
			</Hide>
		</div>
	);
}
