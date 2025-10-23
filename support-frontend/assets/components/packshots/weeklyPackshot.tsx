import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import GridPicture from 'components/gridPicture/gridPicture';

const weeklyPackShotContainer = css`
	.subscriptions-feature-packshot {
		width: 140%;

		${from.tablet} {
			width: 600px;
			margin-top: 45px;
		}

		img {
			width: 100%;

			${from.desktop} {
				width: 700px;
				right: -50px;
			}
		}
	}
`;

function WeeklyPackShot(): JSX.Element {
	return (
		<div css={weeklyPackShotContainer}>
			<GridPicture
				sources={[
					{
						gridId: 'subscriptionGuardianWeeklyHeroMobile',
						srcSizes: [1000, 500],
						sizes: '100vw',
						imgType: 'png',
						media: '(max-width: 739px)',
					},
					{
						gridId: 'subscriptionGuardianWeeklyHeroTablet',
						srcSizes: [1000, 500],
						sizes: '100vw',
						imgType: 'png',
						media: '(max-width: 979px)',
					},
				]}
				fallback="subscriptionGuardianWeeklyHeroPackShot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="png"
			/>
		</div>
	);
}

export default WeeklyPackShot;
