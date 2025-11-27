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

interface CacheEntry {
	data: AnalyticsProfileData;
	timestamp: number;
}

class AnalyticsProfileCache {
	private cache: Promise<CacheEntry> | null = null;
	private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

	async get(): Promise<AnalyticsProfileData> {
		if (
			!this.cache ||
			Date.now() - (await this.cache).timestamp > this.CACHE_TTL_MS
		) {
			console.debug('AnalyticsProfileCache: cache miss/expired');
			this.cache = this.startRefresh();
		} else {
			console.debug('AnalyticsProfileCache: cache hit');
		}

		return (await this.cache).data;
	}

	private startRefresh = () =>
		fetchJson<{
			identityId: string;
			hasMobileAppDownloaded: boolean;
			hasFeastMobileAppDownloaded: boolean;
		}>('/analytics-user-profile', {
			mode: 'cors',
			credentials: 'include',
		}).then((response) => ({
			timestamp: Date.now(),
			data: {
				hasMobileAppDownloaded: response.hasMobileAppDownloaded,
				hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
			},
		}));

	clear(): void {
		console.debug('AnalyticsProfileCache: clear');
		this.cache = null;
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
}: {
	children: ReactNode;
}) {
	const cacheRef = useRef<AnalyticsProfileCache>();

	if (!cacheRef.current) {
		cacheRef.current = new AnalyticsProfileCache();
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
