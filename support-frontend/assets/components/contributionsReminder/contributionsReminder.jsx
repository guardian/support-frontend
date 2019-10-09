// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgSubscribed from 'components/svgs/subscribed';
import TrackableButton from 'components/button/trackableButton';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';
import { connect } from 'react-redux';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';

// ----- Types ----- //
type PropTypes = {
  email: string | null,
  csrf: CsrfState,
}

type ButtonState = 'initial' | 'pending' | 'success' | 'fail';

type StateTypes = {
  buttonState: ButtonState;
}

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
});

// ----- Render ----- //
class ContributionsReminder extends Component<PropTypes, StateTypes> {
  static defaultProps = {
    email: null,
  }

  state = {
    buttonState: 'initial',
  }

  requestIsPending = (): void => {
    this.setState({
      buttonState: 'pending',
    });
  }

  requestHasSucceeded = (): void => {
    this.setState({
      buttonState: 'success',
    });
  }

  requestHasFailed = (): void => {
    this.setState({
      buttonState: 'fail',
    });
  }

  renderButtonCopy = (buttonState: ButtonState): string => {
    switch (buttonState) {
      case 'initial':
        return 'Remind me in December';
      case 'pending':
        return 'Pending...';
      case 'success':
        return 'Signed up';
      case 'fail':
        return 'Sorry, something went wrong';
      default:
        return 'Remind me in December';
    }
  }

  render() {
    const { email, csrf } = this.props;
    const requestParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Csrf-Token': csrf.token || '',
      },
      body: {
        ReminderCreatedEvent: {
          email,
        },
      },
    };

    if (email && csrf.token) {
      const isSuccess = this.state.buttonState === 'success';
      const isClicked = this.state.buttonState !== 'initial';

      return (
        <section className="contribution-thank-you-block">
          <h3 className="contribution-thank-you-block__title">
            Set up a reminder for the end of the year
          </h3>
          <p className="contribution-thank-you-block__message">
            {'Lots of readers choose to make single contributions at various points in the year. Opt in to receive a reminder in December, in case you would like to support our journalism again. This will be a single email, with no obligation. Thank you.'}
          </p>

          <TrackableButton
            icon={isSuccess ? <SvgSubscribed /> : <SvgSubscribe />}
            aria-label={this.renderButtonCopy(this.state.buttonState)}
            appearance={isClicked ? 'disabled' : 'primary'}
            disabled={isClicked}
            trackingEvent={
              () => {
                trackComponentLoad('reminder-test-link-loaded');
              }
            }
            onClick={
              () => {
                this.requestIsPending();

                trackComponentClick('reminder-test-link-clicked');
                
                fetch(routes.createReminder, {
                  method: requestParams.method,
                  headers: requestParams.headers,
                  body: JSON.stringify(requestParams.body),
                }).then((response) => {
                  if (response.ok) {
                    this.requestHasSucceeded();
                  } else {
                    this.requestHasFailed();
                    logException('Reminder sign up failed at the point of request');
                  }
                });
              }
            }
          >
            { this.renderButtonCopy(this.state.buttonState) }
          </TrackableButton>
        </section>
      );
    }

    logException('Unable to display reminder sign up due to not having a valid email address or CSRF token to send to the API');
    return null;
  }
}

// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsReminder);
