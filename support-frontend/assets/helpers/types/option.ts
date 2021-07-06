// ----- Type ----- //
export type Option<A> = A | null;

// ----- Helpers ----- //
function headOption<A>(arr: Array<A>): Option<A> {
	return arr[0] !== undefined ? arr[0] : null;
}

// ----- Exports ----- //
export { headOption };
