import { NetworkCollector } from '../network/NetworkCollector';

describe('NetworkCollector', () => {
  let collector: NetworkCollector;
  let mockPage: any;
  let eventHandlers: Record<string, Function>;

  beforeEach(() => {
    eventHandlers = {};
    mockPage = {
      on: jest.fn().mockImplementation((event, handler) => {
        eventHandlers[event] = handler;
      }),
    };
    collector = new NetworkCollector();
    collector.attach(mockPage as any);
  });

  it('should capture network request and response', () => {
    const mockRequest = {
      url: jest.fn().mockReturnValue('http://api.test.com/data'),
      method: jest.fn().mockReturnValue('GET'),
      headers: jest.fn().mockReturnValue({ accept: 'application/json' }),
      postData: jest.fn().mockReturnValue(null),
      isNavigationRequest: jest.fn().mockReturnValue(false),
      redirectedFrom: jest.fn().mockReturnValue(null),
    };

    const mockResponse = {
      request: jest.fn().mockReturnValue(mockRequest),
      headers: jest.fn().mockReturnValue({ 'content-type': 'application/json' }),
      status: jest.fn().mockReturnValue(200),
    };

    eventHandlers['request'](mockRequest);
    eventHandlers['response'](mockResponse);

    const collection = collector.getCollection();
    expect(collection.entries).toHaveLength(1);
    
    const entry = collection.entries[0];
    expect(entry.url).toBe('http://api.test.com/data');
    expect(entry.statusCode).toBe(200);
    expect(entry.duration).toBeGreaterThanOrEqual(0);
  });

  it('should capture failed requests', () => {
    const mockRequest = {
      url: jest.fn().mockReturnValue('http://api.test.com/fail'),
      method: jest.fn().mockReturnValue('GET'),
      headers: jest.fn().mockReturnValue({}),
      postData: jest.fn().mockReturnValue(null),
      isNavigationRequest: jest.fn().mockReturnValue(false),
      redirectedFrom: jest.fn().mockReturnValue(null),
      failure: jest.fn().mockReturnValue({ errorText: 'net::ERR_CONNECTION_REFUSED' }),
    };

    eventHandlers['request'](mockRequest);
    eventHandlers['requestfailed'](mockRequest);

    const collection = collector.getCollection();
    expect(collection.entries[0].error).toBe('net::ERR_CONNECTION_REFUSED');
  });
});
