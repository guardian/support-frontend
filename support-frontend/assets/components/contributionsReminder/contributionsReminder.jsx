// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import TrackableButton from 'components/button/trackableButton';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';
import { connect } from 'react-redux';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { Label as FormLabel } from 'components/forms/label';

// ----- Types ----- //
type PropTypes = {
  email: string | null,
  csrf: CsrfState,
}

type ButtonState = 'initial' | 'pending' | 'success' | 'fail';

type StateTypes = {
  buttonState: ButtonState;
  selectedDate: string | null;
  selectedDateAsWord: string | null,
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
    selectedDate: null,
    selectedDateAsWord: null,
  }

  setDateState = (evt: any, date: string, dateAsWord: string) => {
    if (!evt.target.checked || !date) {
      return null;
    }

    return this.setState({
      selectedDate: date,
      selectedDateAsWord: dateAsWord,
    });
  }

  requestHasSucceeded = (): void => {
    this.setState({
      buttonState: 'success',
    });
  }

  requestIsPending = (): void => {
    this.setState({
      buttonState: 'pending',
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
        return 'Set my reminder';
      case 'pending':
        return 'Pending...';
      case 'success':
        return 'Signed up';
      case 'fail':
        return 'Sorry, something went wrong';
      default:
        return 'Set my reminder';
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
        email,
        reminderDate: this.state.selectedDate,
      },
    };

    if (email && csrf.token) {
      const isClicked = this.state.buttonState !== 'initial';

      return (
        <section className="contribution-thank-you-block contribution-thank-you-block--reminders">
          <h3 className="contribution-thank-you-block__title">
            Set up a reminder for the end of the year
          </h3>
          <p className="contribution-thank-you-block__message">
            {'Lots of readers choose to make single contributions at various points in the year. Opt in to receive a reminder in case you would like to support our journalism again. This will be a single email, with no obligation.'}
          </p>

          <FormLabel label="Remind me in:" htmlFor={null}>
            <Fieldset legend="Choose one of the following dates to receive your reminder:">
              <RadioInput id="march2020" text="March 2020" name="reminder" onChange={evt => this.setDateState(evt, '2020-03-19 00:00:00', 'march2020')} />
              <RadioInput id="june2020" text="June 2020" name="reminder" onChange={evt => this.setDateState(evt, '2020-06-19 00:00:00', 'june2020')} />
              <RadioInput id="december2020" text="December 2020" name="reminder" onChange={evt => this.setDateState(evt, '2020-12-19 00:00:00', 'december2020')} />
            </Fieldset>
          </FormLabel>

          <TrackableButton
            icon={false}
            aria-label={this.renderButtonCopy(this.state.buttonState)}
            appearance={isClicked ? 'disabled' : 'secondary'}
            disabled={isClicked || !this.state.selectedDate}
            trackingEvent={
              () => {
                trackComponentLoad('reminder-test-link-loaded');
              }
            }
            onClick={
              () => {
                this.requestIsPending();

                trackComponentClick('reminder-test-link-clicked');
                if (this.state.selectedDateAsWord) { trackComponentClick(`reminder-test-date-${this.state.selectedDateAsWord}`); }

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
