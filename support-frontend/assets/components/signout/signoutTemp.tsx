import { connect } from 'react-redux';
import type { Participations } from 'helpers/abTests/abtest';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';

// ---- Types ----- //

interface SignoutProps {
	abVariant: Participations;
}

// ----- Component ----- //

function SignoutTemp(abTests: SignoutProps) {
	const testmsg2 = !abTests.abVariant.newProduct
		? 'NOT Found ABtest newProduct'
		: `FOUND ABtest newProduct='${abTests.abVariant.newProduct}'`;
	console.log(testmsg2);

	return <a className="component-signout">- {testmsg2} -</a>;
}

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
	return {
		abVariant: state.common.abParticipations,
	};
}

// ----- Exports ----- //

export default connect(mapStateToProps)(SignoutTemp);
