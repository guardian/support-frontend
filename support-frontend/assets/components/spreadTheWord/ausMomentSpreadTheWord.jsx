// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';
import { isProd } from 'helpers/url';

// ----- Component ----- //

type PropTypes = {| email: string|};

const generateSharingCode = () => {
  const salt = Math.floor((Math.random() * 100) + 1).toString(36)
  const timestamp = new Date().getTime().toString(36)
  return (salt + timestamp).toUpperCase()
};

const sharingCodeEndpoint = isProd()
  ? 'https://contribution-referrals.support.guardianapis.com/referral'
  : 'https://contribution-referrals-code.support.guardianapis.com/referral';

const postSharingCode = (endPoint: string, sharingCode: string, email: string) => {
  fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'thankyou',
      code: sharingCode,
      email,
    }),
  }).then((response) => {
    console.log(`responseStatus: ${response.status}`);
  });
};

export default function AusMomentSpreadTheWord(props: PropTypes) {
  const sharingCode = generateSharingCode();
  postSharingCode(sharingCodeEndpoint, sharingCode, props.email);

  const title = 'Share your support';
  const message = 'We need more people like you. Invite your friends, family and colleagues in Australia and beyond to support the Guardian. We’ll email you to let you know if one or more people make a contribution from your post or message. You’re doing something powerful to help sustain our open, independent journalism – thank you.';

  return (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">{title}</h3>
      <p className="contribution-thank-you-block__message">{message}</p>
      <div className="component-spread-the-word__share">
        <SocialShare name="facebook" referralCode={sharingCode} />
        <SocialShare name="twitter" referralCode={sharingCode} />
        <SocialShare name="linkedin" referralCode={sharingCode} />
        <SocialShare name="email" referralCode={sharingCode} />
      </div>
    </div>
  );

}
