// @flow
import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';

// ----- Types ----- //

export type SessionId = ?string;


// ----- Setup ----- //

function getAndStoreId(keyName) {
  let value = storage.getSession(keyName);
  if (value === null) {
    value = uuidv4();
    storage.setSession(keyName, value);
  }
  return value;
}

const initialState: SessionId = getAndStoreId('sessionId');

// ----- Reducer ----- //

export default function sessionIdReducer(state: SessionId = initialState): SessionId {
  return state;
}
