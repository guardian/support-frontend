// @flow

// ----- Imports ----- //
import { type Tab } from './tabs';

// ----- Action Creators ----- //
export type TabActions = { type: 'SET_TAB', tab: Tab }

const { setTab } = (tab: Tab) => ({ type: 'SET_TAB', tab });

// ----- Exports ----- //

export { setTab };
