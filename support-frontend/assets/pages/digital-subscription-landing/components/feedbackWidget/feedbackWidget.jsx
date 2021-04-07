// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, buttonBrand } from '@guardian/src-button';
import { SvgMinus, SvgPlus } from '@guardian/src-icons';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { clickedCss, wrapper } from './feedbackWidgetStyles';

// type PropTypes = {}

function FeedbackWidget(/* { }: PropTypes */) {

  const [clicked, setClicked] = useState({ positive: false, negative: false });

  return (
    <div css={wrapper}>
      <h1>Feedback</h1>
      <ThemeProvider theme={buttonBrand}>
        <Button
          priority="subdued"
          size="default"
          icon={<SvgPlus />}
          iconSide="left"
          cssOverrides={clicked.positive ? clickedCss : null}
          onClick={() => {
            sendTrackingEventsOnClick({
              id: 'landing_feedback_positive',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })();

            setClicked({ positive: true, negative: false });
          }}
        />
      </ThemeProvider>
      <ThemeProvider theme={buttonBrand}>
        <Button
          priority="subdued"
          size="default"
          icon={<SvgMinus />}
          iconSide="left"
          cssOverrides={clicked.negative ? clickedCss : null}
          onClick={() => {
            sendTrackingEventsOnClick({
              id: 'landing_feedback_negative',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })();

            setClicked({ positive: false, negative: true });
          }}
        />
      </ThemeProvider>

    </div>
  );
}

export default FeedbackWidget;
