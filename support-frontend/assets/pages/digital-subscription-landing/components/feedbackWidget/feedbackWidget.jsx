// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgCross } from '@guardian/src-icons';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { clickedCss, wrapper, buttonStyles, feedbackLink, header } from './feedbackWidgetStyles';
import { SvgThumbsUp } from './thumbsUp';
import { SvgThumbsDown } from './thumbsDown';

function FeedbackWidget() {

  const [clicked, setClicked] = useState({ positive: false, negative: false });
  const positiveButtonCss = clicked.positive ? clickedCss : null;
  const negativeButtonCss = clicked.negative ? clickedCss : null;

  return (
    <aside css={wrapper}>
      <header css={header}>
        <h4>{clicked.negative ? 'What can we improve?' : 'Is this page helpful?'}</h4>
        {clicked.negative || (
          <span>
            <ThemeProvider theme={buttonBrand}>
              <Button
                priority="subdued"
                size="small"
                hideLabel
                icon={<SvgThumbsUp />}
                cssOverrides={[positiveButtonCss, buttonStyles]}
                onClick={() => {
              sendTrackingEventsOnClick({
                id: 'ds_landing_page_survey_positive',
                product: 'DigitalPack',
                componentType: 'SURVEYS_QUESTIONS',
              })();

              setClicked({ positive: true, negative: false });
            }}
              />
            </ThemeProvider>
            <ThemeProvider theme={buttonBrand}>
              <Button
                priority="subdued"
                size="small"
                hideLabel
                icon={<SvgThumbsDown />}
                cssOverrides={[negativeButtonCss, buttonStyles]}
                onClick={() => {
              sendTrackingEventsOnClick({
                id: 'ds_landing_page_survey_negative',
                product: 'DigitalPack',
                componentType: 'SURVEYS_QUESTIONS',
              })();

              setClicked({ positive: false, negative: true });
            }}
              />
            </ThemeProvider>
          </span>
        )}

        {clicked.negative && (
          <ThemeProvider theme={buttonBrand}>
            <Button
              priority="subdued"
              size="small"
              hideLabel
              icon={<SvgCross />}
              cssOverrides={[buttonStyles]}
              onClick={() => {
                sendTrackingEventsOnClick({
                  id: 'ds_landing_page_survey_close',
                  product: 'DigitalPack',
                  componentType: 'SURVEYS_QUESTIONS',
                })();

                setClicked({ positive: false, negative: false });
              }}
            />
          </ThemeProvider>
        )}
      </header>
      {clicked.negative && (
        <section css={feedbackLink}>
          <p>Your feedback is really helpful; answer our two short questions to help us improve this page.</p>
          <LinkButton
            size="small"
            href="https://www.surveymonkey.co.uk/r/63XM7CX"
          >
            Tell us what you think
          </LinkButton>
        </section>
      )}
    </aside>
  );
}

export default FeedbackWidget;
