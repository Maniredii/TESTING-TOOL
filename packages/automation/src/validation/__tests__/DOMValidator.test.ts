import { DOMValidator } from '../validators/DOMValidator';
import { Severity } from '../severity/Severity';

describe('DOMValidator', () => {
  let validator: DOMValidator;

  beforeEach(() => {
    validator = new DOMValidator();
  });

  it('should detect broken links', async () => {
    const context: any = {
      evidenceBundle: {
        domSnapshots: [
          { html: '<a href="#">Click here</a>' }
        ]
      }
    };

    const findings = await validator.validate(context);
    const brokenLinks = findings.filter(f => f.title === 'Broken Link');
    
    expect(brokenLinks).toHaveLength(1);
    expect(brokenLinks[0].severity).toBe(Severity.MEDIUM);
  });

  it('should detect missing images', async () => {
    const context: any = {
      evidenceBundle: {
        domSnapshots: [
          { html: '<img src="">' }
        ]
      }
    };

    const findings = await validator.validate(context);
    const missingImages = findings.filter(f => f.title === 'Missing Image Source');
    
    expect(missingImages).toHaveLength(1);
    expect(missingImages[0].severity).toBe(Severity.HIGH);
  });
});
