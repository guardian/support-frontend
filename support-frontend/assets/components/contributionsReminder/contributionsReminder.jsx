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

type StateTypes = {
  clicked: boolean,
  pending: boolean,
  successful: boolean,
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
    clicked: false,
    pending: false,
    successful: false,
  }

  setButtonClickedState = (): void => {
    this.setState({
      clicked: true,
      pending: true,
    });
  }

  setSuccessfulState = (): void => {
    this.setState({
      pending: false,
      successful: true,
    });
  }

  setFailedState = (): void => {
    this.setState({
      pending: false,
      successful: false,
    });
  }

  renderButtonCopy = (): string => {
    const { clicked, pending, successful } = this.state;
    const defaultState = !clicked && !pending && !successful;
    const pendingState = clicked && pending && !successful;
    const failedState = clicked && !pending && !successful;
    const successState = clicked && !pending && successful;

    if (defaultState) {
      return 'Remind me in December';
    }

    if (pendingState) {
      return 'Pending...';
    }

    if (failedState) {
      return 'Sorry, something went wrong.';
    }

    if (successState) {
      return 'Signed up';
    }

    return 'Remind me in December';
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
      return (
        <section className="contribution-thank-you-block">
          <h3 className="contribution-thank-you-block__title">
            Set up a reminder for the end of the year
          </h3>
          <p className="contribution-thank-you-block__message">
            {'Lots of readers choose to make single contributions at various points in the year. Opt in to receive a reminder in December, in case you would like to support our journalism again. This will be a single email, with no obligation. Thank you.'}
          </p>

          <TrackableButton
            icon={this.state.successful ? <SvgSubscribed /> : <SvgSubscribe />}
            aria-label={this.renderButtonCopy()}
            appearance={this.state.clicked ? 'disabled' : 'primary'}
            disabled={!!this.state.clicked}
            trackingEvent={
              () => {
                trackComponentLoad('reminder-test-link-loaded');
              }
            }
            onClick={
              () => {
                this.setButtonClickedState();

                trackComponentClick('reminder-test-link-clicked');

                // JTL - TBD - UPDATE THIS ROUTE:
                fetch(routes.contributionsSendMarketing, {
                  method: requestParams.method,
                  headers: requestParams.headers,
                  body: JSON.stringify(requestParams.body),
                }).then((response) => {
                  if (response.ok) {
                    this.setSuccessfulState();
                  } else {
                    this.setFailedState();
                    logException('Reminder sign up failed at the point of request');
                  }
                });
              }
            }
          >
            { this.renderButtonCopy() }
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
