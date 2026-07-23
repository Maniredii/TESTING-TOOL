import { ScreenshotCollector } from '../screenshots/ScreenshotCollector';

describe('ScreenshotCollector', () => {
  let collector: ScreenshotCollector;
  let mockPage: any;

  beforeEach(() => {
    mockPage = {
      screenshot: jest.fn().mockResolvedValue(Buffer.from('fake-image')),
    };
    collector = new ScreenshotCollector(mockPage as any);
  });

  it('should capture a screenshot and store it in collection', async () => {
    const entry = await collector.capture('BEFORE_ACTION', 'action-1', 'png');
    
    expect(mockPage.screenshot).toHaveBeenCalledWith({
      type: 'png',
      fullPage: false,
      quality: undefined,
    });
    expect(entry.type).toBe('BEFORE_ACTION');
    expect(entry.actionId).toBe('action-1');
    expect(entry.format).toBe('png');
    expect(entry.buffer).toBeDefined();

    const collection = collector.getCollection();
    expect(collection.screenshots).toHaveLength(1);
    expect(collection.screenshots[0].id).toBe(entry.id);
  });

  it('should capture full page for FAILURE type', async () => {
    await collector.capture('FAILURE', 'action-2', 'jpeg');
    
    expect(mockPage.screenshot).toHaveBeenCalledWith({
      type: 'jpeg',
      fullPage: true,
      quality: 70,
    });
  });
});
