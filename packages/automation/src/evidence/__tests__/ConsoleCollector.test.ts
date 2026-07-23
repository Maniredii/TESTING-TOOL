import { ConsoleCollector } from '../console/ConsoleCollector';

describe('ConsoleCollector', () => {
  let collector: ConsoleCollector;
  let mockPage: any;
  let eventHandlers: Record<string, Function>;

  beforeEach(() => {
    eventHandlers = {};
    mockPage = {
      on: jest.fn().mockImplementation((event, handler) => {
        eventHandlers[event] = handler;
      }),
    };
    collector = new ConsoleCollector();
    collector.attach(mockPage as any);
  });

  it('should capture console log messages', () => {
    collector.setCurrentActionId('action-1');
    
    const mockMsg = {
      type: jest.fn().mockReturnValue('log'),
      text: jest.fn().mockReturnValue('Hello World'),
      location: jest.fn().mockReturnValue({ url: 'http://test.com', lineNumber: 42 }),
    };

    eventHandlers['console'](mockMsg);

    const collection = collector.getCollection();
    expect(collection.entries).toHaveLength(1);
    expect(collection.entries[0].type).toBe('log');
    expect(collection.entries[0].text).toBe('Hello World');
    expect(collection.entries[0].actionId).toBe('action-1');
    expect(collection.entries[0].location).toBe('http://test.com:42');
  });

  it('should capture page errors', () => {
    const error = new Error('Something crashed');
    eventHandlers['pageerror'](error);

    const collection = collector.getCollection();
    expect(collection.entries).toHaveLength(1);
    expect(collection.entries[0].type).toBe('exception');
    expect(collection.entries[0].text).toBe('Something crashed');
  });
});
