import { css, ThemeProvider } from '@emotion/react';
import { neutral, space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeBrandAlt,
	TextInput,
} from '@guardian/source-react-components';
import { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Error } from 'components/forms/customFields/error';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import CalendarIcon from './calendarIcon.svg';
import {
	dateIsOutsideRange,
	getLatestAvailableDateText,
	getRange,
} from './helpers';
import './styles.scss';
import 'react-day-picker/lib/style.css';

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
	border: 2px ${neutral[60]} solid;
`;
const marginTop = css`
	margin-top: ${space[5]}px;
`;
type PropTypes = {
	value?: string;
	onChange: (value: string) => void;
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
			dateValidated: null,
		};
	}

	componentDidMount(): void {
		this.handleCalendarDate(new Date(Date.now()));
	}

	getDateString = (): string =>
		`${this.state.year}-${this.state.month}-${this.state.day}`;

	getDateConfirmationText = (): string => {
		const { value } = this.props;

		if (!value) {
			return '';
		}

		// Specifying midnight means that the Date object will always be the selected date in the user's time zone
		// A date instantiated with just new Date('2021-01-01') will be in UTC and causes time zone issues
		const valueDate = new Date(`${value}T00:00:00`);
		const today = new Date();
		const confirmedDate = today > valueDate ? today : valueDate;

		return `${confirmedDate.getDate()} ${
			monthText[confirmedDate.getMonth()]
		} ${confirmedDate.getFullYear()}`;
	};

	checkDateIsValid = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		e.preventDefault();
		const date = new Date(this.getDateString());
		const dateIsNotADate = !DateUtils.isDate(date);
		const latestAvailableDate = getLatestAvailableDateText();

		this.setState({
			dateValidated: true,
			dateError: '',
		});

		if (dateIsNotADate) {
			this.handleError(
				'No date has been selected as the date is not valid. Please try again',
			);
		} else if (dateIsOutsideRange(date)) {
			this.handleError(
				`No date has been recorded as the date entered was not available. Please enter a date up to ${latestAvailableDate}`,
			);
		}
	};

	handleError = (error: string): void => {
		this.setState((prevState) => ({
			...prevState,
			dateError: error,
			day: '',
			month: '',
			year: '',
		}));
		this.updateStartDate();
	};

	handleCalendarDate = (date: Date): void => {
		if (dateIsOutsideRange(date)) {
			return;
		}

		const dateArray = formatMachineDate(date).split('-');
		this.setState(
			{
				dateError: '',
				dateValidated: false,
				day: dateArray[2],
				month: dateArray[1],
				year: dateArray[0],
			},
			this.updateStartDate,
		);
	};

	handleInput = (value: string, field: keyof StateTypes): void => {
		if (/^[0-9]+$/.test(value)) {
			this.setState((prevState) => ({
				...prevState,
				[field]: value,
				dateError: '',
				dateValidated: false,
			}));
			this.updateStartDate();
		} else {
			this.setState((prevState) => ({
				...prevState,
				[field]: '',
				dateError: '',
				dateValidated: false,
			}));
			this.updateStartDate();
		}
	};

	updateStartDate = (): void => {
		const dateString = this.getDateString();

		if (DateUtils.isDate(new Date(dateString))) {
			return this.props.onChange(dateString);
		}

		return this.props.onChange('');
	};

	render(): JSX.Element {
		const { state } = this;
		const today = Date.now();
		const currentMonth = new Date(today);
		const threeMonthRange = DateUtils.addMonths(currentMonth, 3);

		return (
			<div>
				<fieldset
					css={startDateGroup}
					role="group"
					aria-describedby="date-hint"
				>
					<legend id="date-hint">
						{`Please choose a date up to ${getLatestAvailableDateText()} for your gift to be emailed to the recipient.`}
					</legend>
					<div css={startDateFields}>
						<div css={inputLayoutWithMargin}>
							<TextInput
								label="Day"
								value={state.day}
								onChange={(e) => this.handleInput(e.target.value, 'day')}
								minLength={1}
								maxLength={2}
								type="text"
								width={4}
							/>
						</div>
						<div css={inputLayoutWithMargin}>
							<TextInput
								label="Month"
								value={state.month}
								onChange={(e) => this.handleInput(e.target.value, 'month')}
								minLength={1}
								maxLength={2}
								type="text"
								width={4}
							/>
						</div>
						<div>
							<TextInput
								label="Year"
								value={state.year}
								onChange={(e) => this.handleInput(e.target.value, 'year')}
								minLength={4}
								maxLength={4}
								type="text"
								width={4}
							/>
						</div>

						<button
							aria-hidden
							css={calendarIconContainer}
							onClick={(e) => {
								e.preventDefault();
								this.setState({
									showCalendar: !this.state.showCalendar,
								});
							}}
						>
							<CalendarIcon />
						</button>
					</div>
				</fieldset>
				{state.showCalendar && (
					<DayPicker
						onDayClick={(day) => this.handleCalendarDate(day)}
						disabledDays={[
							{
								before: new Date(today),
							},
							{
								after: getRange(),
							},
						]}
						weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
						fromMonth={currentMonth}
						toMonth={threeMonthRange}
					/>
				)}
				<ThemeProvider theme={buttonThemeBrandAlt}>
					<Button
						priority="tertiary"
						size="small"
						css={validationButton}
						onClick={(e) => this.checkDateIsValid(e)}
					>
						Check date
					</Button>
				</ThemeProvider>
				<span>
					{state.dateError && (
						<div role="status" aria-live="assertive" css={marginTop}>
							<Error error={state.dateError} />
						</div>
					)}
				</span>
				<span>
					{!state.dateError && state.dateValidated && (
						<div role="status" aria-live="assertive" css={marginTop}>
							{`Your gift will be delivered on ${this.getDateConfirmationText()}`}
						</div>
					)}
				</span>
			</div>
		);
	}
}

export default DatePickerFields;
