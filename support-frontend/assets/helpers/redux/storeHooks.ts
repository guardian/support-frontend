import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type {
	ContributionsDispatch,
	ContributionsState,
} from './contributionsStore';

export const useContributionsDispatch: () => ContributionsDispatch =
	useDispatch;
export const useContributionsSelector: TypedUseSelectorHook<ContributionsState> =
	useSelector;
