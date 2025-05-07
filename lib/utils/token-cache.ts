/**
 * Token cache utility for managing API token caching
 * 
 * This module provides a memory-based token cache for development purposes.
 * In a production environment, consider using a more robust solution like:
 * - Redis for distributed caching
 * - Azure Key Vault for secure token storage
 * - Database-backed caching
 */

type CacheEntry<T> = {
  value: T;
  expiresAt: number; // timestamp in seconds
};

/**
 * Simple in-memory token cache implementation with expiration
 */
export class MemoryTokenCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Store a value in the cache with an expiration time
   * 
   * @param key - The cache key
   * @param value - The value to store
   * @param expiresInSeconds - Number of seconds until expiration
   */
  set<T>(key: string, value: T, expiresInSeconds: number): void {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    this.cache.set(key, {
      value,
      expiresAt: nowInSeconds + expiresInSeconds,
    });
  }

  /**
   * Get a value from the cache if it exists and hasn't expired
   * 
   * @param key - The cache key
   * @param bufferSeconds - Optional buffer time (in seconds) before expiration to consider the value expired
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string, bufferSeconds = 0): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    
    if (entry && entry.expiresAt > nowInSeconds + bufferSeconds) {
      return entry.value;
    }
    
    // Clean up expired entry
    if (entry) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Remove a value from the cache
   * 
   * @param key - The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries from the cache
   * 
   * @returns The number of entries removed
   */
  cleanExpired(): number {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    let removed = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= nowInSeconds) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }
}

// Export a singleton instance for use throughout the application
export const tokenCache = new MemoryTokenCache();

// Default export for when users want to create their own instance
export default MemoryTokenCache;