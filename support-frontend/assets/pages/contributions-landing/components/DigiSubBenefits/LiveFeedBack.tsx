import { css, keyframes } from '@emotion/react';
import { from, neutral, space, success } from '@guardian/source-foundations';
import { InlineSuccess } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { priceWithGlyph } from './helpers';
import { useLiveFeedBackContext } from './LiveFeedBackProvider';

const slideInFadeOut = keyframes`
  25% {
    transform: translateX(0);
  }

  75%  {
    opacity: 1;
  }

  100% {
    opacity: 0; transform: translateX(0);
  }
`;
const slideInFadeOutDesktop = keyframes`
  25% {
    transform: translateX(-66px);
  }

  75%  {
    opacity: 1;
  }

  100% {
    opacity: 0; transform: translateX(-66px);
  }
`;

const inlineSuccessContainer = css`
	position: sticky;
	top: 20px;
	z-index: 1;
	transform: translateX(-500px);
	opacity: 1;

	${from.mobileMedium} {
		max-width: 316px;
	}

	${from.mobileLandscape} {
		max-width: initial;
	}
`;

const animate = css`
	animation-name: ${slideInFadeOut};
	animation-duration: 5s;

	${from.leftCol} {
		animation-name: ${slideInFadeOutDesktop};
	}
`;

const inlineSuccess = css`
	position: absolute;
	border-left: 4px solid ${success[400]};
	background-color: ${neutral[100]};
	align-items: center;
	font-weight: bold;
	padding: ${space[4]}px 28px ${space[4]}px 20px;
	box-sizing: border-box;
	box-shadow: 0px 0px 10px rgb(0 0 0 / 20%);

	${from.leftCol} {
		padding-right: 30px;
	}

	& svg {
		transform: translate(0, 0);
		align-self: baseline;
		margin-right: 2px;
	}
`;

interface LiveFeedBackProps {
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
}

function LiveFeedBack({
	contributionType,
	countryGroupId,
}: LiveFeedBackProps): JSX.Element {
	const liveFeedBackContext = useLiveFeedBackContext();

	const price = priceWithGlyph(countryGroupId, contributionType);

	return (
		<div
			css={
				liveFeedBackContext?.showLiveFeedBack
					? [inlineSuccessContainer, animate]
					: inlineSuccessContainer
			}
			aria-hidden={liveFeedBackContext?.showLiveFeedBack ? 'false' : 'true'}
			onAnimationEnd={() => liveFeedBackContext?.setShowLiveFeedBack(false)}
		>
			<InlineSuccess cssOverrides={inlineSuccess} role="alert">
				Your amout has been changed to {price}
			</InlineSuccess>
		</div>
	);
}

export default LiveFeedBack;
