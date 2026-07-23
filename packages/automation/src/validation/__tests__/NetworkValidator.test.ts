import { NetworkValidator } from '../validators/NetworkValidator';
import { Severity } from '../severity/Severity';

describe('NetworkValidator', () => {
  let validator: NetworkValidator;

  beforeEach(() => {
    validator = new NetworkValidator();
  });

  it('should detect failed requests', async () => {
    const context: any = {
      evidenceBundle: {
        metadata: { url: 'http://example.com' },
        network: {
          entries: [
            { url: 'http://example.com/api', error: 'net::ERR_FAILED' }
          ]
        }
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('Failed Network Request');
    expect(findings[0].severity).toBe(Severity.HIGH);
  });

  it('should detect HTTP errors', async () => {
    const context: any = {
      evidenceBundle: {
        metadata: { url: 'http://example.com' },
        network: {
          entries: [
            { url: 'http://example.com/api', statusCode: 500 }
          ]
        }
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('HTTP Error Status Code');
    expect(findings[0].severity).toBe(Severity.CRITICAL);
  });

  it('should detect mixed content', async () => {
    const context: any = {
      evidenceBundle: {
        metadata: { url: 'https://secure.com' },
        network: {
          entries: [
            { url: 'http://insecure.com/script.js', statusCode: 200 }
          ]
        }
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('Mixed Content');
    expect(findings[0].severity).toBe(Severity.HIGH);
  });
});
