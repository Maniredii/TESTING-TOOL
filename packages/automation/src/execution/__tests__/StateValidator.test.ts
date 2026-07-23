import { StateValidator } from '../../validators/StateValidator';

describe('StateValidator', () => {
  let mockPage: any;
  let mockLocator: any;

  beforeEach(() => {
    mockPage = {
      url: jest.fn().mockReturnValue('http://example.com/next'),
      locator: jest.fn().mockReturnValue({
        count: jest.fn().mockResolvedValue(0),
      }),
    };

    mockLocator = {
      count: jest.fn().mockResolvedValue(1),
    };
  });

  it('should validate successful action state', async () => {
    const result = await StateValidator.validate(mockPage, mockLocator, 'http://example.com/prev', undefined);

    expect(result.isValid).toBe(true);
    expect(result.checks.actionCompleted).toBe(true);
    expect(result.checks.elementExists).toBe(true);
    expect(result.checks.navigationOccurred).toBe(true);
    expect(result.checks.noUnexpectedError).toBe(true);
  });

  it('should fail if action threw an error', async () => {
    const error = new Error('action failed');
    const result = await StateValidator.validate(mockPage, mockLocator, 'http://example.com/prev', error);

    expect(result.isValid).toBe(false);
    expect(result.checks.actionCompleted).toBe(false);
  });

  it('should handle unexpected error dialogs', async () => {
    mockPage.locator.mockReturnValue({
      count: jest.fn().mockResolvedValue(1), // Error dialog exists
    });

    const result = await StateValidator.validate(mockPage, mockLocator, 'http://example.com/prev', undefined);

    expect(result.isValid).toBe(false);
    expect(result.checks.noUnexpectedError).toBe(false);
  });
});
