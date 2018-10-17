// @flow

// ----- Types ----- //

export type ScopeToken = ?string;


// ----- Setup ----- //

const initialState: ScopeToken =
  window.guardian && window.guardian.scopeToken ? window.guardian.scopeToken : null;


// ----- Reducer ----- //

export default function scopeTokenReducer(state: ScopeToken = initialState): ScopeToken {
  return state;
}
