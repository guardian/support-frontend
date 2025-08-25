import { css } from '@emotion/react';
import { article17, from, palette, space } from '@guardian/source/foundations';

const container = css`
	background-color: ${palette.brand[800]};
	border-radius: 12px;
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

const copyContainer = css``;

const bodyContainer = css`
	${article17};
	color: ${palette.neutral[0]};
	margin-top: ${space[4]}px;

	p + p {
		margin-top: ${space[4]}px;
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
			<div css={copyContainer}>
				<h1>Understand the world with the Guardian</h1>
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
			<div css={imageContainer}>
				<img css={image} src="https://placehold.co/375" />
			</div>
		</div>
	);
};
