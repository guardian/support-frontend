import { useEffect, useState } from 'react';
import { z } from 'zod';

// ---- Types ---- //

export enum SecondaryCtaType {
	None,
	Reminder,
}

export interface ReminderSecondaryCta {
	type: SecondaryCtaType.Reminder;
	reminderCta: string;
	isReminderActive: boolean;
	onReminderCtaClicked: () => void;
}

export interface NoSecondarCta {
	type: SecondaryCtaType.None;
}

export type SecondaryCta = NoSecondarCta | ReminderSecondaryCta;

// ---- Hooks ---- //

export function useSecondaryCta(): SecondaryCta {
	const { isReminderActive, onReminderCtaClicked } = useReminderCta();

	const reminderCta = getReminderCta();

	if (reminderCta) {
		return {
			type: SecondaryCtaType.Reminder,
			reminderCta,
			isReminderActive,
			onReminderCtaClicked,
		};
	}

	return { type: SecondaryCtaType.None };
}

// The reason for the complexity here is because the reminder CTA is rendered
// inside of the iframe, but the reminder signup form that is opened after
// clicking the CTA is rendered directly in the Epic. If we stick with this
// embedded checkout page, we should consider implementing the reminder UI
// here too. When the reminder CTA is clicked, we post a message to the Epic
// so that it can show the UI. Additionally we need some state to keep track of
// this as we don't render the CTAs whilst the reminder UI is open. We also set up
// an event listener as the Epic will post a message when the reminder UI is closed
// which allows us to reshow the CTAs.
function useReminderCta() {
	const [isReminderActive, setIsReminderActive] = useState(false);

	function onReminderCtaClicked() {
		window.parent.postMessage({ type: 'REMINDER_CTA_CLICKED' }, '*');
		setIsReminderActive(true);
	}

	useEffect(() => {
		function handler(ev: MessageEvent<unknown>) {
			const result = reminderCloseClickedMessageSchema.safeParse(ev.data);
			if (result.success) {
				setIsReminderActive(false);
			}
		}

		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
	});

	return { isReminderActive, onReminderCtaClicked };
}

const reminderCloseClickedMessageSchema = z.object({
	type: z.literal('REMINDER_CLOSE_CLICKED'),
});

// ---- Helper ---- //

function getReminderCta() {
	const params = new URLSearchParams(window.location.search);

	return params.get('reminderCta');
}
