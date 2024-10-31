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
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const containerNewspaperArchive = css`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	background-color: #1e3e72;
	padding: ${space[4]}px ${space[4]}px 0px ${space[4]}px;
	text-align: left;

	${until.desktop} {
		margin: ${space[9]}px -10px 0;
		padding-bottom: 0;
	}
	${from.desktop} {
		margin-top: ${space[8]}px;
		border-radius: 0 ${space[3]}px ${space[3]}px 0;
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

export function NewspaperArchiveBanner() {
	return (
		<div css={containerNewspaperArchive}>
			<div css={headlineAndParagraph}>
				<h2 css={headlineText}>
					<>
						<NewBenefitPill />{' '}
					</>
					The Guardian newspaper archive: explore more than 200 years of
					journalism
				</h2>
				<p css={paragraphText}>
					Since 1821, the world's major events have been documented in the pages
					of the Guardian. Today, you can search through and view that record of
					history with access to the Guardian archives.
				</p>
			</div>
			<img
				css={image}
				alt=""
				src="https://i.guim.co.uk/img/media/6a10c564d225dc23d3a24098a033464769740f01/0_0_1781_868/1000.png?width=1000&quality=75&s=16aec938fdd59f7a23f14fa7131fe554"
			/>
		</div>
	);
}
