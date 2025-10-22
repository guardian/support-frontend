import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import GridPicture from 'components/gridPicture/gridPicture';

const subscriptions_feature_packshot = css`
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

function GuardianWeeklyPackShotHero(): JSX.Element {
	return (
		<div
			className="subscriptions-feature-packshot"
			css={subscriptions_feature_packshot}
		>
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

export default GuardianWeeklyPackShotHero;
