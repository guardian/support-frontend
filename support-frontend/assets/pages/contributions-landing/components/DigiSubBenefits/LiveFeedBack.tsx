import { css, keyframes } from '@emotion/react';
import { neutral, success } from '@guardian/source-foundations';
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

const inlineSuccessContainer = css`
	position: sticky;
	top: 20px;
	z-index: 1;
	transform: translateX(-500px);
	opacity: 1;
`;

const animate = css`
	animation-name: ${slideInFadeOut};
	animation-duration: 5s;
`;

const inlineSuccess = css`
	position: absolute;
	border: 4px solid ${success[400]};
	background-color: ${neutral[100]};
	align-items: center;
	font-weight: bold;
	padding: 1px 6px 1px 1px;

	& svg {
		transform: translate(0, 0);
		align-self: baseline;
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
	const showLiveFeedBack = useLiveFeedBackContext()?.showLiveFeedBack;
	const setShowLiveFeedBack = useLiveFeedBackContext()?.setShowLiveFeedBack;

	const price = priceWithGlyph(countryGroupId, contributionType);

	return (
		<div
			css={
				showLiveFeedBack
					? [inlineSuccessContainer, animate]
					: inlineSuccessContainer
			}
			aria-hidden={showLiveFeedBack ? 'false' : 'true'}
			onAnimationEnd={() => setShowLiveFeedBack?.(false)}
		>
			<InlineSuccess cssOverrides={inlineSuccess} role="alert">
				Your amout has been changed to {price}
			</InlineSuccess>
		</div>
	);
}

export default LiveFeedBack;
