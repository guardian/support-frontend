/**
 * In-memory cache for analytics profile data using React Context.
 * This cache is shared across all hook instances within the same provider tree,
 * preventing duplicate API calls without requiring cookies or localStorage.
 * Data is cleared when the page is refreshed (no GDPR concerns).
 */

import { createContext, type ReactNode, useContext, useRef } from 'react';

interface AnalyticsProfileData {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
	audienceMemberships: number[];
}

interface CacheEntry {
	data: AnalyticsProfileData;
	timestamp: number;
}

class AnalyticsProfileCache {
	private cache: CacheEntry | null = null;
	private pendingRequest: Promise<AnalyticsProfileData> | null = null;
	private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

	get(): AnalyticsProfileData | null {
		if (!this.cache) {
			console.debug('AnalyticsProfileCache: cache miss');
			return null;
		}

		const isExpired = Date.now() - this.cache.timestamp > this.CACHE_TTL_MS;
		if (isExpired) {
			console.debug('AnalyticsProfileCache: cache expired');
			this.cache = null;
			return null;
		}

		console.debug('AnalyticsProfileCache: cache hit');
		return this.cache.data;
	}

	set(data: AnalyticsProfileData): void {
		console.debug('AnalyticsProfileCache: setting cache');
		this.cache = {
			data,
			timestamp: Date.now(),
		};
	}

	getPendingRequest(): Promise<AnalyticsProfileData> | null {
		console.debug('AnalyticsProfileCache: getPendingRequest');
		return this.pendingRequest;
	}

	setPendingRequest(promise: Promise<AnalyticsProfileData>): void {
		console.debug('AnalyticsProfileCache: setPendingRequest');
		this.pendingRequest = promise;
	}

	clearPendingRequest(): void {
		console.debug('AnalyticsProfileCache: clearPendingRequest');
		this.pendingRequest = null;
	}

	clear(): void {
		console.debug('AnalyticsProfileCache: clear cache');
		this.cache = null;
		this.pendingRequest = null;
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
