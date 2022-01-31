// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { getSignoutUrl } from 'helpers/urls/externalLinks';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';

// ---- Types ----- //

interface SignoutProps {
	isSignedIn: boolean;
	returnUrl?: string;
}

// ----- Component ----- //

function Signout({ isSignedIn, returnUrl }: SignoutProps) {
	if (!isSignedIn) {
		return null;
	}

	return (
		<a className="component-signout" href={getSignoutUrl(returnUrl)}>
			Not you? Sign out
		</a>
	);
}

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
	return {
		isSignedIn: state.page.user.isSignedIn,
	};
}

// ----- Exports ----- //

export default connect(mapStateToProps)(Signout);
