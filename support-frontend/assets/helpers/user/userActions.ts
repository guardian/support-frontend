import type { Dispatch } from 'redux';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

// ----- Types ----- //
export type Action =
	| {
			type: 'SET_USER_ID';
			id: string;
	  }
	| {
			type: 'SET_DISPLAY_NAME';
			name: string;
	  }
	| {
			type: 'SET_FIRST_NAME';
			name: string;
	  }
	| {
			type: 'SET_LAST_NAME';
			name: string;
	  }
	| {
			type: 'SET_FULL_NAME';
			name: string;
	  }
	| {
			type: 'SET_EMAIL';
			email: string;
	  }
	| {
			type: 'SET_STATEFIELD';
			stateField: string;
	  }
	| {
			type: 'SET_TEST_USER';
			testUser: boolean;
	  }
	| {
			type: 'SET_IS_RECURRING_CONTRIBUTOR';
	  }
	| {
			type: 'SET_POST_DEPLOYMENT_TEST_USER';
			postDeploymentTestUser: boolean;
	  }
	| {
			type: 'SET_GNM_MARKETING';
			preference: boolean;
	  }
	| {
			type: 'SET_IS_SIGNED_IN';
			isSignedIn: boolean;
	  }
	| {
			type: 'SET_EMAIL_VALIDATED';
			emailValidated: boolean;
	  }
	| {
			type: 'SET_IS_RETURNING_CONTRIBUTOR';
			isReturningContributor: boolean;
	  }
	| {
			type: 'global/validateForm';
			paymentMethod?: PaymentMethod;
	  };

export type UserSetStateActions = {
	setId: (id: string) => Action;
	setDisplayName: (displayName: string) => Action;
	setFirstName: (firstName: string) => Action;
	setLastName: (lastName: string) => Action;
	setFullName: (fullName: string) => Action;
	setEmail: (email: string) => Action;
	setTestUser: (testUser: boolean) => Action;
	setPostDeploymentTestUser: (postDeploymentTestUser: boolean) => Action;
	setGnmMarketing: (gnmMarketing: boolean) => Action;
	setEmailValidated: (emailValidated: boolean) => Action;
	setIsReturningContributor: (isReturningContributor: boolean) => Action;
	// When we change either of these in the context of the contributions landing page,
	// we need to dispatch some additional actions to update some state in the
	// contributions landing page state as well as update the user state, hence the union type.
	setIsSignedIn: (
		isSignedIn: boolean,
	) => Action | ((dispatch: Dispatch) => void);
	setIsRecurringContributor: () => Action | ((dispatch: Dispatch) => void);
	setStateField: (
		stateField: string,
	) => Action | ((dispatch: Dispatch) => void);
};
