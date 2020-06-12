// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';
import { isProd } from 'helpers/url';

// ----- Component ----- //

type PropTypes = {| email: string|};

/* The comment below overrides the default ESLint rule to allow necessary bitwise operators */
/* eslint no-bitwise: ["error", { "allow": ["<<", "|=", ">>>"] }] */
const generateSharingCode = (date: Date) => {
  const salt = Math.floor((Math.random() * 100) + 1);
  const s = date.toISOString() + salt;
  let hash = 0;
  let i;
  let chr;
  for (i = 0; i < s.length; i += 1) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr; hash |= 0;
  }
  return (hash >>> 0);
};

const sharingCodeEndpoint = isProd()
  ? 'https://contribution-referrals.support.guardianapis.com/referral'
  : 'https://contribution-referrals-code.support.guardianapis.com/referral';

const postSharingCode = (endPoint: string, sharingCode: number, email: string) => {
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
  const date = new Date();
  const sharingCode = generateSharingCode(date);
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
