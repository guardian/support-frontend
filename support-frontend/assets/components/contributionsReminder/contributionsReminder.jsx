// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import TrackableButton from 'components/button/trackableButton';
import { trackComponentClick, trackComponentLoad } from 'helpers/tracking/behaviour';
import { connect } from 'react-redux';
import { createReminderEndpoint } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { Label as FormLabel } from 'components/forms/label';

// ----- Types ----- //
type PropTypes = {
  email: string | null,
}

type ReminderDate = {
  dateName: string,
  timeStamp: string,
}

type ButtonState = 'initial' | 'pending' | 'success' | 'fail';

type StateTypes = {
  buttonState: ButtonState;
  selectedDate: string | null;
  selectedDateAsWord: string | null,
}

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
});

const reminderDates: Array<ReminderDate> = [
  {
    dateName: 'March 2020',
    timeStamp: '2020-03-19 00:00:00',
  },
  {
    dateName: 'June 2020',
    timeStamp: '2020-06-01 00:00:00',
  },
  {
    dateName: 'December 2020',
    timeStamp: '2020-12-01 00:00:00',
  },
];

const randomIndex: number = Math.floor(Math.random() * (reminderDates.length));

const trimAndDowncase = (word: string) => word.replace(/\s+/g, '').toLowerCase();
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

  componentDidMount = () => {
    this.setState({
      selectedDate: reminderDates[randomIndex].timeStamp,
      selectedDateAsWord: trimAndDowncase(reminderDates[randomIndex].dateName),
    });
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
    const { email } = this.props;

    if (email) {
      const isClicked = this.state.buttonState !== 'initial';

      return (
        <section className="contribution-thank-you-block contribution-thank-you-block--reminders">
          <h3 className="contribution-thank-you-block__title">
            Set up a reminder to contribute again
          </h3>
          <p className="contribution-thank-you-block__message">
            {'Lots of readers choose to make single contributions at various points in the year. Opt in to receive a reminder in case you would like to support our journalism again. This will be a single email, with no obligation.'}
          </p>

          <FormLabel label="Remind me in:" htmlFor={null}>
            <Fieldset legend="Choose one of the following dates to receive your reminder:">
              {reminderDates.map((reminderDate, index) => {
                const dateWithoutSpace = trimAndDowncase(reminderDate.dateName);
                return (
                  <RadioInput
                    id={dateWithoutSpace}
                    text={reminderDate.dateName}
                    name="reminder"
                    onChange={evt => this.setDateState(evt, reminderDate.timeStamp, dateWithoutSpace)}
                    defaultChecked={index === randomIndex}
                  />
                );
              })}
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

                fetch(createReminderEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email,
                    reminderDate: this.state.selectedDate,
                  }),
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

    logException('Unable to display reminder sign up due to not having a valid email address to send to the API');
    return null;
  }
}

// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsReminder);
