import {
	asFormattedString,
	combinedAddressLine,
	truncateForZuoraStreetNameLimit,
} from '../model/address';

describe('combinedAddressLine', () => {
	test('it should return an AddressLine when there is only a lineOne', () => {
		const lineOne = '123 trash alley';

		const combined = combinedAddressLine(lineOne, undefined);

		const expected = { streetNumber: '123', streetName: 'trash alley' };

		expect(combined).toStrictEqual(expected);
	});

	test('it should return an AddressLine when there is lineOne and a lineTwo', () => {
		const lineOne = '123 trash alley';
		const lineTwo = 'bin 5';

		const combined = combinedAddressLine(lineOne, lineTwo);

		const expected = {
			streetNumber: '123',
			streetName: 'trash alley, bin 5',
		};

		expect(combined).toStrictEqual(expected);
	});

	test('it should return undefined when there is neither a lineOne nor a lineTwo', () => {
		const combined = combinedAddressLine(undefined, undefined);

		const expected = undefined;

		expect(combined).toStrictEqual(expected);
	});

	test(
		'it should still return an AddressLine when there are two address lines and ' +
			'the second line has the street number',
		() => {
			const lineOne = 'bin 5';
			const lineTwo = '123 trash alley';

			const combined = combinedAddressLine(lineOne, lineTwo);

			const expected = {
				streetNumber: '123',
				streetName: 'trash alley, bin 5',
			};

			expect(combined).toStrictEqual(expected);
		},
	);

	test('clipForZuoraStreetNameLimit should clip street name to 100 characters', () => {
		const tooLongStreetName =
			'trash alley, bin 5, you know how to find that particular bin because it is the one with ' +
			'the fairy lights that never come down';

		const addressLine = { streetNumber: '123', streetName: tooLongStreetName };

		const truncated = truncateForZuoraStreetNameLimit(addressLine);

		const expected = {
			streetNumber: '123',
			streetName:
				'trash alley, bin 5, you know how to find that particular bin because it is the one with the fairy li',
		};

		expect(truncated).toStrictEqual(expected);
	});

	test('asFormattedString should combine a street number and a street name', () => {
		const addressLine = {
			streetNumber: '123',
			streetName: 'trash alley, bin 5',
		};
		expect(asFormattedString(addressLine)).toStrictEqual(
			'123 trash alley, bin 5',
		);
	});

	test('asFormattedString should just return street name if there is no street number', () => {
		const addressLine = {
			streetNumber: undefined,
			streetName: 'trash alley, bin 5',
		};
		expect(asFormattedString(addressLine)).toStrictEqual('trash alley, bin 5');
	});
});
