export class URLNormalizer {
  /**
   * Normalizes a URL based on crawling rules to prevent duplicate nodes.
   * Options can be passed from TestConfiguration.
   */
  public static normalize(
    rawUrl: string, 
    options: { ignoreQueryParams?: boolean, ignoreFragments?: boolean } = {}
  ): string {
    try {
      const urlObj = new URL(rawUrl);

      // Always strip trailing slashes from pathname (except root)
      if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }

      // Handle fragments (anchor links like #section1)
      // Usually, fragments don't represent a new page load, so they should be ignored by default
      // for graph traversal unless explicitly tracking intra-page navigation.
      if (options.ignoreFragments !== false) {
        urlObj.hash = '';
      }

      // Handle query parameters
      if (options.ignoreQueryParams) {
        urlObj.search = '';
      } else {
        // Sort query parameters to ensure deterministic URLs
        // e.g. ?b=2&a=1 becomes ?a=1&b=2
        const searchParams = new URLSearchParams(urlObj.search);
        searchParams.sort();
        urlObj.search = searchParams.toString();
      }

      return urlObj.toString();
    } catch (e) {
      // If parsing fails (e.g., relative URL without base), return trimmed lowercase
      return rawUrl.trim().toLowerCase();
    }
  }

  /**
   * Resolves a relative URL against a base URL
   */
  public static resolve(relativeOrAbsolute: string, baseUrl: string): string {
    try {
      return new URL(relativeOrAbsolute, baseUrl).toString();
    } catch {
      return relativeOrAbsolute;
    }
  }
}
