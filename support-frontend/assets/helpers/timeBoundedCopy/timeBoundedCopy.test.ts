import { getTimeboundCopy } from './timeBoundedCopy';
describe('Time bounded copy', () => {
	const copy = 'Hello this is a test';
	let testCopy;
	beforeEach(() => {
		testCopy = {
			newspaper: [
				{
					startShowingOn: '2021-01-01',
					stopShowingOn: '2021-12-31',
					copy,
				},
			],
		};
	});
	describe('Getting copy within the date bounds', () => {
		it('returns copy for the specified page when the passed date matches a copy item', () => {
			expect(
				getTimeboundCopy('newspaper', new Date('2021-05-05'), testCopy),
			).toBe(copy);
		});
		it('returns the first copy item in the list where the passed date matches', () => {
			testCopy.newspaper.unshift({
				startShowingOn: '2020-01-01',
				copy: 'I am some more prominent copy',
			});
			expect(
				getTimeboundCopy('newspaper', new Date('2021-05-05'), testCopy),
			).toBe('I am some more prominent copy');
		});
	});
	describe('Getting copy too early', () => {
		it('returns null if the passed date is too early', () => {
			expect(
				getTimeboundCopy('newspaper', new Date('2020-05-05'), testCopy),
			).toBeNull();
		});
	});
	describe('Getting copy too late', () => {
		it('returns null if the passed date is too late', () => {
			expect(
				getTimeboundCopy('newspaper', new Date('2022-05-05'), testCopy),
			).toBeNull();
		});
	});
});
