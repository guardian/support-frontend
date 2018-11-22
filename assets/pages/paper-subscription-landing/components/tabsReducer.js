// @flow


// ----- Imports ----- //
import { type TabActions } from './tabsActions';
import { type Tab } from './tabs';

// ----- Redux ----- //
export type TabsState = {
  active: Tab
}

export const tabsReducer = (state: TabsState = {
  active: 'collection',
}, action: TabActions): TabsState => {

  switch (action.type) {

    case 'SET_TAB':
      return { ...state, active: action.tab };

    default:
      return state;

  }

};
