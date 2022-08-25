import { connect } from 'react-redux';
import type { Participations } from 'helpers/abTests/abtest';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';

// ---- Types ----- //

interface SignoutProps {
	abVariant: Participations;
}

// ----- Component ----- //

function SignoutTemp(abTests: SignoutProps) {
	console.log(
		'SignOut2 here!!',
		abTests.abVariant,
		//abVariant.abVariant.{'newProduct'},
	);

	// if (abVariant.newProduct !== undefined) {
	// 	console.log('SignOut2 newProduct Field Found!', abVariant.newProduct);
	// }
	// abVariant.abVariant.newProduct;
	// if (abVariant.abVariant.newProduct !== undefined) {
	// 	console.log('SignOut2 NotFound!');
	// } else {
	// 	console.log('SignOut2 Found!', abVariant.newProduct);
	// }

	const testmsg2 = abTests.abVariant.newProduct;
	return (
		<a className="component-signout">
			2Not you? Sign out2 {abTests.abVariant.newProduct} {testmsg2}
		</a>
	);
}

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
	return {
		abVariant: state.common.abParticipations,
	};
}

// ----- Exports ----- //

export default connect(mapStateToProps)(SignoutTemp);
