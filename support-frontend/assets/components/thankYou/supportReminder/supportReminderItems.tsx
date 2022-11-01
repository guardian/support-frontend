import { css } from '@emotion/react';
import { from, neutral, space, textSans } from '@guardian/source-foundations';
import {
	Button,
	Link,
	Radio,
	RadioGroup,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { privacyLink } from 'helpers/legal';
import { setThankYouSupportReminder } from 'helpers/redux/checkout/thankYouState/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {
	createOneOffReminderEndpoint,
	createRecurringReminderEndpoint,
} from 'helpers/urls/routes';
import { isCodeOrProd } from 'helpers/urls/url';
import { logException } from 'helpers/utilities/logger';
import { catchPromiseHandler } from 'helpers/utilities/promise';
import { OPHAN_COMPONENT_ID_SET_REMINDER } from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const form = css`
	margin-top: ${space[5]}px;

	& > * + * {
		margin-top: ${space[5]}px;
	}
`;

const hideBeforeTablet = css`
	display: none;

	${from.tablet} {
		display: block;
	}
`;

const hideAfterTablet = css`
	display: block;

	${from.tablet} {
		display: none;
	}
`;

const privacyText = css`
	${hideBeforeTablet}
	${textSans.small()}
  font-family: GuardianTextSans,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif !important;
	font-size: 15px !important;

	color: ${neutral[20]};
	margin-top: ${space[3]}px;
`;
const privacyTextLink = css`
	${textSans.small()}

	color: ${neutral[20]};
`;
interface RecurringReminderChoice {
	type: 'RECURRING';
	signup: {
		reminderFrequencyMonths: number;
	};
	label: string;
}
interface OneOffReminderChoice {
	type: 'ONE_OFF';
	signup: {
		reminderPeriod: string;
		reminderOption: string;
	};
	label: string;
}
type ReminderChoice = RecurringReminderChoice | OneOffReminderChoice;
const REMINDER_PLATFORM = 'SUPPORT';
const REMINDER_STAGE = 'POST';
const REMINDER_COMPONENT = 'THANKYOU';

const getReminderPeriod = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // javascript dates run from 0-11, we want 1-12

	const paddedMonth = month.toString().padStart(2, '0');
	return `${year}-${paddedMonth}-01`;
};

const getReminderOption = (monthsUntilDate: number) =>
	`${monthsUntilDate}-months`;

const getDefaultLabel = (date: Date, monthsUntilDate: number, now: Date) => {
	const month = date.toLocaleDateString('default', {
		month: 'long',
	});
	const year =
		now.getFullYear() === date.getFullYear() ? '' : ` ${date.getFullYear()}`;
	return `in ${monthsUntilDate} months only (${month}${year})`;
};

const getRecurringReminderChoice = (): ReminderChoice => {
	const now = new Date();
	const startMonth = now.getMonth() + 1;
	const date = new Date(now.getFullYear(), startMonth);
	const month = date.toLocaleDateString('default', {
		month: 'long',
	});
	return {
		type: 'RECURRING',
		label: `Once each month (from ${month})`,
		signup: {
			reminderFrequencyMonths: 1,
		},
	};
};

const getOneOffReminderChoiceWithDefaultLabel = (
	monthsUntilDate: number,
): ReminderChoice => {
	const now = new Date();
	const date = new Date(now.getFullYear(), now.getMonth() + monthsUntilDate);
	return {
		type: 'ONE_OFF',
		label: getDefaultLabel(date, monthsUntilDate, now),
		signup: {
			reminderPeriod: getReminderPeriod(date),
			reminderOption: getReminderOption(monthsUntilDate),
		},
	};
};

const getDefaultReminderChoices = (): ReminderChoice[] => [
	getRecurringReminderChoice(),
	getOneOffReminderChoiceWithDefaultLabel(3),
	getOneOffReminderChoiceWithDefaultLabel(6),
	getOneOffReminderChoiceWithDefaultLabel(9),
];

const getReminderUrl = (choice: ReminderChoice): string => {
	if (choice.type === 'ONE_OFF') {
		return createOneOffReminderEndpoint;
	}

	return createRecurringReminderEndpoint;
};

type SupportReminderState = {
	supportReminderState: {
		selectedChoiceIndex: number;
		hasBeenCompleted: boolean;
		errorMessage: string | null;
	};
};

const reminderChoices = getDefaultReminderChoices();

export function SupportReminderBodyCopy({
	supportReminderState,
}: SupportReminderState): JSX.Element {
	const dispatch = useContributionsDispatch();

	return (
		<>
			{supportReminderState.hasBeenCompleted ? (
				<p>
					We will be in touch at the time you selected, so look out for a
					message from the Guardian in your inbox.
				</p>
			) : (
				<>
					<p>
						<span css={hideAfterTablet}>
							Choose a time when we can invite you to support our journalism
							again. We’ll send you a maximum of two reminder emails, with no
							obligation.
						</span>
						<span css={hideBeforeTablet}>
							Many readers choose to support Guardian journalism by making
							single contributions at various points in the year. Opt in to
							whichever time suits you best, and we’ll send you a maximum of two
							reminder emails, with no obligation.
						</span>
					</p>
					<form css={form}>
						<RadioGroup name="reminder" label="I'd like to be reminded in:">
							{reminderChoices.map((choice, index) => (
								<Radio
									value={choice.label}
									label={choice.label}
									checked={supportReminderState.selectedChoiceIndex === index}
									onChange={() =>
										dispatch(
											setThankYouSupportReminder({
												...supportReminderState,
												selectedChoiceIndex: index,
											}),
										)
									}
								/>
							))}
						</RadioGroup>
					</form>
				</>
			)}
		</>
	);
}

export function SupportReminderCTAandPrivacy({
	email,
	supportReminderState,
}: { email: string } & SupportReminderState): JSX.Element {
	const dispatch = useContributionsDispatch();

	const setReminder = () => {
		const choice = reminderChoices[supportReminderState.selectedChoiceIndex];
		const url = getReminderUrl(choice);

		if (!isCodeOrProd()) return;

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				reminderPlatform: REMINDER_PLATFORM,
				reminderComponent: REMINDER_COMPONENT,
				reminderStage: REMINDER_STAGE,
				...choice.signup,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					logException('Reminder sign up failed at the point of request');
				}
			})
			.catch(catchPromiseHandler('Error creating reminder sign up'));
	};

	const onSubmit = () => {
		setReminder();
		trackComponentClick(OPHAN_COMPONENT_ID_SET_REMINDER);
		dispatch(
			setThankYouSupportReminder({
				...supportReminderState,
				hasBeenCompleted: true,
			}),
		);
	};

	return (
		<>
			<div>
				<Button
					onClick={onSubmit}
					priority="primary"
					size="default"
					icon={<SvgArrowRightStraight />}
					iconSide="right"
					nudgeIcon
				>
					Set my reminder
				</Button>
			</div>
			<p css={privacyText}>
				To find out what personal data we collect and how we use it, please
				visit our{' '}
				<Link
					css={privacyTextLink}
					href={privacyLink}
					target="_blank"
					rel="noopener noreferrer"
					priority="secondary"
				>
					Privacy Policy
				</Link>
				.
			</p>
		</>
	);
}
