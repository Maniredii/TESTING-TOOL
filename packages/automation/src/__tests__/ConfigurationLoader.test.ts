import { ConfigurationLoader } from '../services/ConfigurationLoader';
import { ConfigurationError } from '../errors';

describe('ConfigurationLoader', () => {
  it('should successfully parse a valid raw configuration', () => {
    const raw = {
      projectId: 'proj-123',
      id: 'conf-456',
      browser: 'WEBKIT',
      headless: false,
      timeout: 10000,
    };

    const config = ConfigurationLoader.load(raw, 'exec-789');

    expect(config.executionId).toBe('exec-789');
    expect(config.projectId).toBe('proj-123');
    expect(config.configId).toBe('conf-456');
    expect(config.browser).toBe('webkit');
    expect(config.headless).toBe(false);
    expect(config.timeout).toBe(10000);
    
    // Check defaults
    expect(config.viewportWidth).toBe(1920);
    expect(config.recordVideo).toBe(true);
  });

  it('should default to chromium if unknown browser is provided', () => {
    const raw = { projectId: 'p1', id: 'c1', browser: 'opera' };
    const config = ConfigurationLoader.load(raw, 'exec');
    expect(config.browser).toBe('chromium');
  });

  it('should support edge browser', () => {
    const raw = { projectId: 'p1', id: 'c1', browser: 'edge' };
    const config = ConfigurationLoader.load(raw, 'exec');
    expect(config.browser).toBe('edge');
  });

  it('should throw ConfigurationError if projectId or id is missing', () => {
    expect(() => ConfigurationLoader.load({ projectId: 'p1' }, 'exec')).toThrow(ConfigurationError);
    expect(() => ConfigurationLoader.load({ id: 'c1' }, 'exec')).toThrow(ConfigurationError);
  });
});
