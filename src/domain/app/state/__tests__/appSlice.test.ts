import { appApi, useSendFeedbackMutation, stringifyQuery } from '../appSlice';
import { configureStore } from '@reduxjs/toolkit';

// Mock fetch to test actual API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('appSlice', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('stringifyQuery helper', () => {
    // Helper function to test param conversion
    const testStringification = (params: Record<string, any>, expected: string) => {
      expect(stringifyQuery(params)).toBe(expected);
    };

    // Helper function to test that decoded values match original
    const testRoundTrip = (params: Record<string, any>) => {
      const result = stringifyQuery(params);
      const decoded = new URLSearchParams(result);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          expect(decoded.get(key)).toBe(String(value));
        }
      });
    };

    it('should convert simple object to URL-encoded string', () => {
      testStringification(
        { name: 'John Doe', age: 30, city: 'Helsinki' },
        'name=John%20Doe&age=30&city=Helsinki'
      );
    });

    it('should handle special characters correctly', () => {
      const params = {
        message: 'Hello & welcome!',
        email: 'user+test@example.com',
        symbols: '!@#$%^&*()'
      };
      
      const result = stringifyQuery(params);
      
      // Test specific encodings
      expect(result).toContain('message=Hello%20%26%20welcome!');
      expect(result).toContain('email=user%2Btest%40example.com');
      expect(result).toContain('symbols=!%40%23%24%25%5E%26*()');
      
      // Test round-trip decoding
      testRoundTrip(params);
    });

    it('should include null values (but not undefined)', () => {
      testStringification(
        { name: 'John', email: null, age: undefined },
        'name=John&email=null'
      );
    });

    it('should handle various value types', () => {
      const testCases = [
        { params: { name: 'John', description: '', city: 'Helsinki' }, expected: 'name=John&description=&city=Helsinki' },
        { params: { active: true, verified: false, name: 'John' }, expected: 'active=true&verified=false&name=John' },
        { params: { count: 0, price: 9.99, id: 123 }, expected: 'count=0&price=9.99&id=123' },
        { params: {}, expected: '' },
      ];

      testCases.forEach(({ params, expected }) => {
        testStringification(params, expected);
      });
    });
  });

  describe('sendFeedback mutation', () => {
    // Helper to create store and mock response for each test
    const createTestStore = () => configureStore({
      reducer: {
        [appApi.reducerPath]: appApi.reducer,
      },
      middleware: (gDM) => gDM().concat(appApi.middleware),
    });

    const mockApiResponse = () => {
      const responseBody = JSON.stringify({ success: true });
      const response = new Response(responseBody, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      mockFetch.mockResolvedValueOnce(response);
    };

    it.each([
      {
        name: 'without email',
        input: { feedback: 'Test feedback message' },
        expectedBody: 'description=Test%20feedback%20message&service_request_type=OTHER&can_be_published=false&internal_feedback=true&service_code=2807',
      },
      {
        name: 'with email',
        input: { feedback: 'Test feedback message', email: 'test@example.com' },
        expectedBody: 'description=Test%20feedback%20message&service_request_type=OTHER&can_be_published=false&internal_feedback=true&service_code=2807&email=test%40example.com',
      },
      {
        name: 'with special characters',
        input: { feedback: 'Hello & world!', email: 'user+test@example.com' },
        expectedBody: 'description=Hello%20%26%20world!&service_request_type=OTHER&can_be_published=false&internal_feedback=true&service_code=2807&email=user%2Btest%40example.com',
      },
    ])('should make correct API request $name', async ({ input, expectedBody }) => {
      mockApiResponse();
      const store = createTestStore();

      // Call the actual mutation
      const result = await store.dispatch(appApi.endpoints.sendFeedback.initiate(input));

      // Verify the mutation was successful
      expect(result.data).toEqual({ success: true });

      // Verify the fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [request] = mockFetch.mock.calls[0];
      
      expect(request.url).toBe('https://api.hel.fi/servicemap/open311/');
      expect(request.method).toBe('POST');
      expect(request.headers.get('content-type')).toBe('application/x-www-form-urlencoded');
      
      // Get the body from the request
      const actualBody = await request.text();
      expect(actualBody).toBe(expectedBody);

      // Verify body can be decoded correctly
      const decodedParams = new URLSearchParams(actualBody);
      expect(decodedParams.get('description')).toBe(input.feedback);
      expect(decodedParams.get('service_request_type')).toBe('OTHER');
      expect(decodedParams.get('can_be_published')).toBe('false');
      expect(decodedParams.get('internal_feedback')).toBe('true');
      expect(decodedParams.get('service_code')).toBe('2807');

      if (input.email) {
        expect(decodedParams.get('email')).toBe(input.email);
      } else {
        expect(decodedParams.has('email')).toBe(false);
      }
    });
  });
});