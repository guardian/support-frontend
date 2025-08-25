import { css } from '@emotion/react';
import { article17, from, palette, space } from '@guardian/source/foundations';

const container = css`
	background-color: ${palette.brand[800]};
	border-radius: ${space[3]}px;
	display: flex;
	flex-direction: column;
	padding: ${space[5]}px ${space[4]}px;
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

const headerImageContainer = css`
	max-width: 310px;

	${from.tablet} {
		width: 310px;
	}

	${from.tablet} {
		width: 375px;
	}
`;

const headerImage = css`
	object-fit: contain;
`;

const imageSection = css`
	${from.tablet} {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}

	${from.desktop} {
		flex-grow: 1;
	}
`;

const imageContainer = css`
	${from.tablet} {
		min-width: 260px;
		max-width: 260px;
	}
`;

const image = css`
	width: 100%;
	height: 100%;
	object-fit: contain;
`;

export const StudentBrandAwareness = () => {
	return (
		<div css={container}>
			<div css={copySection}>
				<div css={headerImageContainer}>
					<h1>
						<img css={headerImage} src="https://placehold.co/310x100" />
					</h1>
				</div>
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
				<div css={imageContainer}>
					<img css={image} src="https://placehold.co/375" />
				</div>
			</div>
		</div>
	);
};
