import React, { Component } from "react";
import { border } from "@guardian/src-foundations/palette";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { formatMachineDate } from "helpers/utilities/dateConversions";
import CalendarIcon from "./calendarIcon.svg";
import { monthText } from "pages/paper-subscription-checkout/helpers/subsCardDays";
import { TextInput } from "@guardian/src-text-input";
import { ThemeProvider } from "emotion-theming";
import { Button, buttonBrandAlt } from "@guardian/src-button";
import { Error } from "components/forms/customFields/error";
import { getLatestAvailableDateText, getRange, dateIsOutsideRange } from "./helpers";
import "./styles.scss";
const calendarIconContainer = css`
  padding: 0;
  border: none;
  width: 41px;
  height: 45px;
  align-self: flex-end;
  margin: 0 0 -${space[1]}px ${space[4]}px;
`;
const startDateGroup = css`
  display: flex;
  flex-direction: column;
`;
const startDateFields = css`
  display: inline-flex;
  margin-top: ${space[3]}px;
`;
const inputLayoutWithMargin = css`
  width: 25%;
  margin-right: ${space[1]}px;
`;
const validationButton = css`
  margin-top: ${space[5]}px;
  border: 2px ${border.primary} solid;
`;
const marginTop = css`
  margin-top: ${space[5]}px;
`;
type PropTypes = {
  value: string | null;
  onChange: (...args: Array<any>) => any;
};
type StateTypes = {
  day: string;
  month: string;
  year: string;
  showCalendar: boolean;
  dateError: string | null;
  dateValidated: boolean | null;
};

class DatePickerFields extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      day: '',
      month: '',
      year: '',
      showCalendar: false,
      dateError: null,
      dateValidated: null
    };
  }

  componentDidMount() {
    this.handleCalendarDate(new Date(Date.now()));
  }

  getDateString = () => `${this.state.year}-${this.state.month}-${this.state.day}`;
  getDateConfirmationText = () => {
    const {
      value
    } = this.props;

    if (!value) {
      return '';
    }

    // Specifying midnight means that the Date object will always be the selected date in the user's time zone
    // A date instantiated with just new Date('2021-01-01') will be in UTC and causes time zone issues
    const valueDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    const confirmedDate = today > valueDate ? today : valueDate;
    return `${confirmedDate.getDate()} ${monthText[confirmedDate.getMonth()]} ${confirmedDate.getFullYear()}`;
  };
  checkDateIsValid = (e: Record<string, any>) => {
    e.preventDefault();
    const date = new Date(this.getDateString());
    const dateIsNotADate = !DateUtils.isDate(date);
    const latestAvailableDate = getLatestAvailableDateText();
    this.setState({
      dateValidated: true,
      dateError: ''
    });

    if (dateIsNotADate) {
      this.handleError('No date has been selected as the date is not valid. Please try again');
    } else if (dateIsOutsideRange(date)) {
      this.handleError(`No date has been recorded as the date entered was not available. Please enter a date up to ${latestAvailableDate}`);
    }
  };
  handleError = (error: string) => {
    this.setState({
      dateError: error,
      day: '',
      month: '',
      year: ''
    });
    this.updateStartDate();
  };
  handleCalendarDate = (date: Date) => {
    if (dateIsOutsideRange(date)) {
      return;
    }

    const dateArray = formatMachineDate(date).split('-');
    this.setState({
      dateError: '',
      dateValidated: false,
      day: dateArray[2],
      month: dateArray[1],
      year: dateArray[0]
    }, this.updateStartDate);
  };
  handleInput = (value: string, field: string) => {
    if (/^[0-9]+$/.test(value) === true) {
      this.setState({
        [field]: value,
        dateError: '',
        dateValidated: false
      }, this.updateStartDate);
    } else {
      this.setState({
        [field]: '',
        dateError: '',
        dateValidated: false
      }, this.updateStartDate);
    }
  };
  updateStartDate = () => {
    const dateString = this.getDateString();

    if (DateUtils.isDate(new Date(dateString))) {
      return this.props.onChange(dateString);
    }

    return this.props.onChange('');
  };

  render() {
    const {
      state
    } = this;
    const today = Date.now();
    const currentMonth = new Date(today);
    const threeMonthRange = DateUtils.addMonths(currentMonth, 3);
    return <div>
        <fieldset css={startDateGroup} role="group" aria-describedby="date-hint">
          <legend id="date-hint">
            {`Please choose a date up to ${getLatestAvailableDateText()} for your gift to be emailed to the recipient.`}
          </legend>
          <div css={startDateFields}>
            <div css={inputLayoutWithMargin}>
              <TextInput label="Day" value={state.day} onChange={e => this.handleInput(e.target.value, 'day')} minLength={1} maxLength={2} type="text" width={4} />
            </div>
            <div css={inputLayoutWithMargin}>
              <TextInput label="Month" value={state.month} onChange={e => this.handleInput(e.target.value, 'month')} minLength={1} maxLength={2} type="text" width={4} />
            </div>
            <div>
              <TextInput label="Year" value={state.year} onChange={e => this.handleInput(e.target.value, 'year')} minLength={4} maxLength={4} type="text" width={4} />
            </div>

            <button aria-hidden css={calendarIconContainer} onClick={e => {
            e.preventDefault();
            this.setState({
              showCalendar: !this.state.showCalendar
            });
          }}>
              <CalendarIcon />
            </button>
          </div>
        </fieldset>
        {state.showCalendar && <DayPicker onDayClick={day => this.handleCalendarDate(day)} disabledDays={[{
        before: new Date(today)
      }, {
        after: getRange()
      }]} weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']} fromMonth={currentMonth} toMonth={threeMonthRange} />}
        <ThemeProvider theme={buttonBrandAlt}>
          <Button priority="tertiary" size="small" css={validationButton} onClick={e => this.checkDateIsValid(e)}>
              Check date
          </Button>
        </ThemeProvider>
        <span>{state.dateError && <div role="status" aria-live="assertive" css={marginTop}><Error error={state.dateError} /></div>}
        </span>
        <span>{!state.dateError && state.dateValidated && <div role="status" aria-live="assertive" css={marginTop}>
            {`Your gift will be delivered on ${this.getDateConfirmationText()}`}
          </div>}
        </span>
      </div>;
  }

}

export default DatePickerFields;