import { ConsoleValidator } from '../validators/ConsoleValidator';
import { Severity } from '../severity/Severity';

describe('ConsoleValidator', () => {
  let validator: ConsoleValidator;

  beforeEach(() => {
    validator = new ConsoleValidator();
  });

  it('should detect JS errors', async () => {
    const context: any = {
      evidenceBundle: {
        consoleLogs: {
          entries: [
            { type: 'error', text: 'ReferenceError: x is not defined' }
          ]
        }
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('JavaScript Console Error');
    expect(findings[0].severity).toBe(Severity.HIGH);
  });

  it('should detect exceptions', async () => {
    const context: any = {
      evidenceBundle: {
        consoleLogs: {
          entries: [
            { type: 'exception', text: 'Uncaught Promise Rejection' }
          ]
        }
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('Unhandled Exception');
    expect(findings[0].severity).toBe(Severity.CRITICAL);
  });
});
