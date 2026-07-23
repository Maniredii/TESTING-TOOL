import { URLNormalizer } from '../navigation/URLNormalizer';

describe('URLNormalizer', () => {
  it('should remove trailing slashes from pathnames', () => {
    expect(URLNormalizer.normalize('https://example.com/path/')).toBe('https://example.com/path');
    expect(URLNormalizer.normalize('https://example.com/')).toBe('https://example.com/');
  });

  it('should remove fragments by default', () => {
    expect(URLNormalizer.normalize('https://example.com/page#section1')).toBe('https://example.com/page');
  });

  it('should ignore query params when requested', () => {
    const opts = { ignoreQueryParams: true };
    expect(URLNormalizer.normalize('https://example.com/page?test=1', opts)).toBe('https://example.com/page');
  });

  it('should sort query params when not ignoring them', () => {
    expect(URLNormalizer.normalize('https://example.com/page?b=2&a=1')).toBe('https://example.com/page?a=1&b=2');
  });
});
