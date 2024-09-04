import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { NewBenefitPill } from 'components/checkoutBenefits/newBenefitPill';

const newspaperArchiveBanner = css`
	margin-top: ${space[8]}px;
	border-radius: 12px;
	background-color: #1e3e72;
	padding: ${space[4]}px;
`;

const headline = css`
	${headlineBold20};
	${from.desktop} {
		${headlineBold24};
	}
	color: ${neutral[100]};
	margin-bottom: ${space[3]}px;
`;

export function NewspaperArchiveBanner() {
	return (
		<div css={newspaperArchiveBanner}>
			<div
				css={css`
					text-align: left;
					${from.desktop} {
						max-width: 400px;
					}
				`}
			>
				<div css={headline}>
					<div
						css={css`
							${until.desktop} {
								display: inline;
								margin-right: ${space[2]}px;
							}
							vertical-align: super;
						`}
					>
						<NewBenefitPill />
					</div>
					The Guardian archives: discover 200 years of journalism
				</div>
				<div
					css={css`
						${textSans17};
						color: ${neutral[100]};
					`}
				>
					Lorem Ipsum, sometimes referred to as 'lipsum', is the placeholder
					text used in design when creating content. It helps designers plan out
					where the content will sit, without needing to wait for the content to
					be written and approved
				</div>
			</div>
		</div>
	);
}
