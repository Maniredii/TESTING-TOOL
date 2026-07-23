import { AccessibilityValidator } from '../validators/AccessibilityValidator';
import { Severity } from '../severity/Severity';

describe('AccessibilityValidator', () => {
  let validator: AccessibilityValidator;

  beforeEach(() => {
    validator = new AccessibilityValidator();
  });

  it('should detect missing alt attributes', async () => {
    const context: any = {
      evidenceBundle: {
        domSnapshots: [
          { html: '<img src="logo.png">' }
        ]
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].title).toBe('Missing Alt Attribute');
    expect(findings[0].severity).toBe(Severity.MEDIUM);
  });

  it('should ignore images with alt attributes', async () => {
    const context: any = {
      evidenceBundle: {
        domSnapshots: [
          { html: '<img src="logo.png" alt="Logo">' }
        ]
      }
    };

    const findings = await validator.validate(context);
    expect(findings).toHaveLength(0);
  });
});
