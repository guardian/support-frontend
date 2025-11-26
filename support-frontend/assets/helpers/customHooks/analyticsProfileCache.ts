/**
 * In-memory cache for analytics profile data.
 * This cache is shared across all hook instances within a single page load,
 * preventing duplicate API calls without requiring cookies or localStorage.
 * Data is cleared when the page is refreshed (no GDPR concerns).
 */

interface AnalyticsProfileData {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
}

interface CacheEntry {
	data: AnalyticsProfileData;
	timestamp: number;
}

class AnalyticsProfileCache {
	private cache: CacheEntry | null = null;
	private pendingRequest: Promise<AnalyticsProfileData> | null = null;
	private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute TTL for page refresh scenarios

	/**
	 * Get cached data if available and not expired
	 */
	get(): AnalyticsProfileData | null {
		if (!this.cache) {
			return null;
		}

		const isExpired = Date.now() - this.cache.timestamp > this.CACHE_TTL_MS;
		if (isExpired) {
			this.cache = null;
			return null;
		}

		return this.cache.data;
	}

	/**
	 * Set cache data
	 */
	set(data: AnalyticsProfileData): void {
		this.cache = {
			data,
			timestamp: Date.now(),
		};
	}

	/**
	 * Get or set pending request promise to deduplicate concurrent requests
	 */
	getPendingRequest(): Promise<AnalyticsProfileData> | null {
		return this.pendingRequest;
	}

	setPendingRequest(promise: Promise<AnalyticsProfileData>): void {
		this.pendingRequest = promise;
	}

	clearPendingRequest(): void {
		this.pendingRequest = null;
	}

	/**
	 * Clear all cache data
	 */
	clear(): void {
		this.cache = null;
		this.pendingRequest = null;
	}
}

// Single shared instance
export const analyticsProfileCache = new AnalyticsProfileCache();
