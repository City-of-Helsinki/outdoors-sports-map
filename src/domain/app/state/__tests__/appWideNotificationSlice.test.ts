import { describe, expect, it, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { appWideNotificationApi, type AppWideNotificationObject, useGetAppWideNotificationsQuery } from '../appWideNotificationSlice';

// Mock fetch for testing API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('appWideNotificationSlice', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('API endpoint', () => {
    it('should make correct API request for notifications', async () => {
      const mockNotifications: AppWideNotificationObject[] = [
        {
          id: 1,
          title: { fi: 'Test Notification', en: 'Test Notification EN' },
          content: { fi: 'Test notification content' },
          external: { fi: 'External link' },
          external_url_title: { fi: 'Link title' },
          lead_paragraph: { fi: 'Lead paragraph' },
          picture_url: 'https://example.com/image.jpg',
        },
      ];

      const mockResponse = { results: mockNotifications };
      
      // Create proper Response object that RTK Query expects
      const response = new Response(JSON.stringify(mockResponse), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      mockFetch.mockResolvedValueOnce(response);

      // Configure store for testing
      const store = configureStore({
        reducer: {
          [appWideNotificationApi.reducerPath]: appWideNotificationApi.reducer,
        },
        middleware: (gDM) => gDM().concat(appWideNotificationApi.middleware),
      });

      // Call the query
      const result = await store.dispatch(appWideNotificationApi.endpoints.getAppWideNotifications.initiate());

      // Verify the query was successful and data was transformed correctly
      expect(result.data).toEqual(mockNotifications);
      expect(result.data).toHaveLength(1);

      // Verify the fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [request] = mockFetch.mock.calls[0];
      
      expect(request.url).toContain('announcement/');
      expect(request.url).toContain('outdoor_sports_map_usage=1');
      expect(request.method).toBe('GET');
    });
  });
});