import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type {
	ContributionsDispatch,
	ContributionsStore,
} from './contributionsStore';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from './subscriptionsStore';

export const useSubscriptionsDispatch: () => SubscriptionsDispatch =
	useDispatch;
export const useSubscriptionsSelector: TypedUseSelectorHook<SubscriptionsState> =
	useSelector;

export const useContributionsDispatch: () => ContributionsDispatch =
	useDispatch;
export const useContributionsSelector: TypedUseSelectorHook<ContributionsStore> =
	useSelector;
