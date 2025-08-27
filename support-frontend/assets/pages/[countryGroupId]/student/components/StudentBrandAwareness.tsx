import { css } from '@emotion/react';
import { article17, from, palette, space } from '@guardian/source/foundations';
import GridImage from 'components/gridImage/gridImage';

const container = css`
	background-color: ${palette.brand[800]};
	border-radius: ${space[3]}px;
	display: flex;
	flex-direction: column;
	padding: ${space[5]}px ${space[4]}px 10px ${space[4]}px;
	gap: ${space[6]}px;

	${from.tablet} {
		flex-direction: row;
		gap: ${space[5]}px;

		padding: ${space[5]}px ${space[10]}px ${space[5]}px ${space[4]}px;
	}

	${from.desktop} {
		padding: ${space[5]}px ${space[2]}px ${space[5]}px ${space[4]}px;
	}
`;

const copySection = css`
	${from.desktop} {
		max-width: 530px;
	}
`;

const bodyContainer = css`
	${article17};
	color: ${palette.neutral[0]};
	margin-top: ${space[4]}px;

	p + p {
		margin-top: ${space[4]}px;
	}
`;

const imageSection = css`
	display: flex;
	justify-content: center;
	align-items: flex-end;

	${from.tablet} {
		align-items: flex-end;
		justify-content: flex-end;
	}

	${from.desktop} {
		flex-grow: 1;
	}
`;

export const StudentBrandAwareness = () => {
	return (
		<div css={container}>
			<div css={copySection}>
				<h1>
					<GridImage
						gridId="globalStudentLandingBrandTitle"
						srcSizes={[310, 620, 375, 750]}
						sizes="(max-width: 939px) 310px, 375px"
						imgType="png"
					/>
				</h1>
				<div css={bodyContainer}>
					<p>
						Whatever you&apos;re studying, quality news is a critical tool for
						making sense of a world in flux. From the AI revolution and its
						impact on jobs, to the future of the climate crisis, the Guardian
						tells the stories that matter and why.
					</p>
					<p>
						Powered by the financial contributions of our readers, we&apos;re
						free to say and challenge who we like &mdash; which is particularly
						important in an age of rising authoritarianism, online
						misinformation and the growing political influence of billionaires.
					</p>
				</div>
			</div>
			<div css={imageSection}>
				<GridImage
					gridId="globalStudentLandingBrand"
					srcSizes={[260, 520]}
					sizes="(max-width: 739px) 240px, 260px"
					imgType="png"
				/>
			</div>
		</div>
	);
};
