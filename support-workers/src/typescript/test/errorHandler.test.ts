import { asRetryError } from '../errors/errorHandler';
import { SalesforceError, salesforceErrorCodes } from '../services/salesforce';

describe('errorHandler', () => {
	test('should throw a retry unlimited error during readonly mode', () => {
		const errorMessage =
			'Failed Upsert of new Contact: Upsert failed. First exception on row 0; first error: INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE, Updates can’t be made during maintenance. Try again when maintenance is complete: []';
		const salesforceError: SalesforceError = new SalesforceError({
			errorCode: salesforceErrorCodes.readOnlyMaintenance,
			message: errorMessage,
		});
		const retryError = asRetryError(salesforceError);
		expect(retryError.name).toEqual('RetryUnlimited');
		expect(retryError.message).toEqual(errorMessage);
	});
	test('should throw a retry none error for generic errors', () => {
		const errorMessage = 'Something went wrong';
		const genericError = new SalesforceError({
			errorCode: 'UNKNOWN_ERROR',
			message: errorMessage,
		});
		const retryError = asRetryError(genericError);
		expect(retryError.name).toEqual('RetryNone');
		expect(retryError.message).toEqual(errorMessage);
	});
});
