// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';
import { generateReferralCode } from "../../helpers/campaignReferralCodes";

// ----- Component ----- //

type PropTypes = {| email: string |};

export default function SpreadTheWord(props: PropTypes) {
  const title = 'Help stretch the signal';
  const message = 'Invite others to support us so that we can deliver truthful, independent reporting on the climate crisis – and keep it open for everyone around the world';
  const referralCode = generateReferralCode(props.email)

  return (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">{title}</h3>
      <p className="contribution-thank-you-block__message">{message}</p>
      <div className="component-spread-the-word__share">
        <SocialShare name="facebook" referralCode={referralCode} />
        <SocialShare name="twitter" referralCode={referralCode} />
        <SocialShare name="linkedin" referralCode={referralCode} />
        <SocialShare name="email" referralCode={referralCode} />
      </div>
    </div>
  );

}
