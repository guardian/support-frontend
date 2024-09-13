import { test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { testTicketTailor } from '../test/ticketTailor';

afterEachTasks(test);

test.describe('TicketTailor', () => {
	[
		{
			internationalisationId: 'uk',
			eventId: '1354460',
		},
	].forEach((testDetails) => {
		testTicketTailor(testDetails);
	});
});
