/**
 * In-memory cache for analytics profile data using React Context.
 * This cache is shared across all hook instances within the same provider tree,
 * preventing duplicate API calls without requiring cookies or localStorage.
 * Data is cleared when the page is refreshed (no GDPR concerns).
 */

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { fetchJson } from '../async/fetch';

interface AnalyticsProfileData {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
}

export class AnalyticsProfileCache {
	// In-flight refresh promise
	private dataPromise: Promise<AnalyticsProfileData> | null = null;
	// Last successful value
	private lastValue: AnalyticsProfileData | null = null;
	// Timestamp of last successful refresh
	private timestamp: number | null = null;
	// TTL in milliseconds
	private readonly ttlMs: number;

	constructor(ttlMs: number = 60 * 1000) {
		this.ttlMs = ttlMs;
	}

	/**
	 * Get cached data with stale-while-revalidate behavior:
	 * - If no successful value yet, trigger a fetch and return the in-flight promise.
	 * - If value exists and is fresh, return it immediately.
	 * - If value exists but is stale, return the last value immediately and kick off a background refresh.
	 * - If the refresh fails, keep returning the last good value.
	 * Concurrent calls during a refresh will share the same in-flight promise.
	 */
	async get(): Promise<AnalyticsProfileData> {
		const now = Date.now();
		const isFresh =
			this.timestamp !== null && now - this.timestamp <= this.ttlMs;

		// No successful value yet: start refresh if needed and return the promise
		if (this.lastValue === null) {
			let promise = this.dataPromise;
			if (!promise) {
				console.debug('AnalyticsProfileCache: initial fetch');
				promise = this.startRefresh();
				this.dataPromise = promise;
			} else {
				console.debug(
					'AnalyticsProfileCache: awaiting in-flight initial fetch',
				);
			}
			return promise;
		}

		// Value exists
		if (isFresh) {
			console.debug('AnalyticsProfileCache: cache hit (fresh)');
			return Promise.resolve(this.lastValue);
		}

		// Stale value: start a background refresh if not already in-flight,
		// but return the last good value immediately
		if (!this.dataPromise) {
			console.debug(
				'AnalyticsProfileCache: cache stale, starting background refresh',
			);
			this.dataPromise = this.startRefresh();
			// Avoid unhandled rejection for background refresh callers
			this.dataPromise.catch(() => {});
		} else {
			console.debug(
				'AnalyticsProfileCache: cache stale, refresh already in-flight',
			);
		}
		return Promise.resolve(this.lastValue);
	}

	private startRefresh = () =>
		fetchJson<{
			identityId: string;
			hasMobileAppDownloaded: boolean;
			hasFeastMobileAppDownloaded: boolean;
		}>('/analytics-user-profile', {
			mode: 'cors',
			credentials: 'include',
		})
			.then((response) => {
				const value: AnalyticsProfileData = {
					hasMobileAppDownloaded: response.hasMobileAppDownloaded,
					hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
				};
				this.lastValue = value;
				this.timestamp = Date.now();
				return value;
			})
			.catch((error) => {
				// Keep lastValue and timestamp unchanged on failure
				console.error('AnalyticsProfileCache: refresh failed', error);
				throw error;
			})
			.finally(() => {
				// Reset the in-flight promise when the refresh completes
				this.dataPromise = null;
			});

	/**
	 * Explicitly clear the cache. Use for identity changes or manual invalidation.
	 */
	clear(): void {
		console.debug('AnalyticsProfileCache: clear');
		this.timestamp = null;
		this.lastValue = null;
		this.dataPromise = null;
	}
}

// Context for sharing cache instance
const AnalyticsProfileCacheContext =
	createContext<AnalyticsProfileCache | null>(null);

/**
 * Provider component that creates and shares a cache instance
 */
export function AnalyticsProfileCacheProvider({
	children,
	ttlMs,
}: {
	children: ReactNode;
	ttlMs?: number;
}) {
	const cacheRef = useRef<AnalyticsProfileCache>();

	if (!cacheRef.current) {
		cacheRef.current = new AnalyticsProfileCache(ttlMs);
	}

	return (
		<AnalyticsProfileCacheContext.Provider value={cacheRef.current}>
			{children}
		</AnalyticsProfileCacheContext.Provider>
	);
}

/**
 * Hook to access the analytics profile cache
 * Must be used within an AnalyticsProfileCacheProvider
 */
export function useAnalyticsProfileCache(): AnalyticsProfileCache {
	const cache = useContext(AnalyticsProfileCacheContext);

	if (!cache) {
		throw new Error(
			'useAnalyticsProfileCache must be used within an AnalyticsProfileCacheProvider',
		);
	}

	return cache;
}
