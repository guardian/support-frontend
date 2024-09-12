import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testTicketTailor } from '../test/ticketTailor';

afterEachTasks(test);

test.describe('TicketTailor', () => {
	[
		{
			internationalisationId: 'uk',
			eventId: '4467889',
		},
	].forEach((testDetails) => {
		testTicketTailor(testDetails);
	});
});
