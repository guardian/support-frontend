// ----- Imports ----- //
import {
	Canada,
	GBPCountries,
	UnitedStates,
} from '../../internationalisation/countryGroup';
import { createUserReducer } from '../userReducer';
// ----- Tests ----- //
describe('user reducer tests', () => {
	it('should return the initial state', () => {
		expect(createUserReducer(GBPCountries)(undefined, {})).toMatchSnapshot();
	});
	it('should have a blank default state for the US', () => {
		expect(createUserReducer(UnitedStates)(undefined, {}).stateField).toBe('');
	});
	it('should have a blank default province for Canada', () => {
		expect(createUserReducer(Canada)(undefined, {}).stateField).toBe('');
	});
	it('should handle SET_DISPLAY_NAME', () => {
		const name = 'John Doe';
		const action = {
			type: 'SET_DISPLAY_NAME',
			name,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.displayName).toEqual(name);
	});
	it('should handle SET_FIRST_NAME', () => {
		const name = 'John';
		const action = {
			type: 'SET_FIRST_NAME',
			name,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.firstName).toEqual(name);
	});
	it('should handle SET_LAST_NAME', () => {
		const name = 'Doe';
		const action = {
			type: 'SET_LAST_NAME',
			name,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.lastName).toEqual(name);
	});
	it('should handle SET_FULL_NAME', () => {
		const name = 'John Doe';
		const action = {
			type: 'SET_FULL_NAME',
			name,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.fullName).toEqual(name);
	});
	it('should handle SET_TEST_USER', () => {
		const testUser = true;
		const action = {
			type: 'SET_TEST_USER',
			testUser,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.isTestUser).toEqual(testUser);
	});
	it('should handle SET_POST_DEPLOYMENT_TEST_USER', () => {
		const postDeploymentTestUser = true;
		const action = {
			type: 'SET_POST_DEPLOYMENT_TEST_USER',
			postDeploymentTestUser,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.isPostDeploymentTestUser).toEqual(postDeploymentTestUser);
	});
	it('should handle SET_EMAIL', () => {
		const email = 'jdoe@example.com';
		const action = {
			type: 'SET_EMAIL',
			email,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.email).toEqual(email);
	});
	it('should handle SET_STATEFIELD', () => {
		const stateField = 'an american state';
		const action = {
			type: 'SET_STATEFIELD',
			stateField,
		};
		const newState = createUserReducer(UnitedStates)(undefined, action);
		expect(newState.stateField).toEqual(stateField);
	});
	it('should handle SET_GNM_MARKETING', () => {
		const preference = true;
		const action = {
			type: 'SET_GNM_MARKETING',
			preference,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.gnmMarketing).toEqual(preference);
	});
	it('should handle SET_IS_RETURNING_CONTRIBUTOR', () => {
		const isReturningContributor = true;
		const action = {
			type: 'SET_IS_RETURNING_CONTRIBUTOR',
			isReturningContributor,
		};
		const newState = createUserReducer(GBPCountries)(undefined, action);
		expect(newState.isReturningContributor).toEqual(isReturningContributor);
	});
});
