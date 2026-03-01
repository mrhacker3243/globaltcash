'use client';

import { useEffect, useCallback, useRef } from 'react';

interface PlanChangeEvent {
  type: 'UPDATE' | 'CREATE' | 'DELETE' | 'CONNECTED';
  planId?: string;
  planData?: any;
  timestamp?: number;
  adminEmail?: string;
  message?: string;
}

export function usePlanSync(callback: (event: PlanChangeEvent) => void, enabled: boolean = true) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Connect to SSE endpoint
    const eventSource = new EventSource('/api/plans/subscribe');
    eventSourceRef.current = eventSource;

    // Handle incoming messages
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as PlanChangeEvent;
        callback(event);
      } catch (err) {
        console.error('Error parsing plan event:', err);
      }
    };

    // Handle errors
    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          // Let useEffect retry
        }
      }, 3000);
    };

    // Cleanup
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [callback, enabled]);

  return {
    isConnected: eventSourceRef.current !== null,
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  };
}

// Alternative hook for test environments or when SSE is not available
export function usePlanSyncPolling(callback: (event: PlanChangeEvent) => void, enabled: boolean = true, interval: number = 5000) {
  const previousDataRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    const pollPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const plans = await res.json();
        
        if (JSON.stringify(previousDataRef.current) !== JSON.stringify(plans)) {
          previousDataRef.current = plans;
          callback({
            type: 'UPDATE',
            planData: plans,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Error polling plans:', err);
      }
    };

    // Initial poll
    pollPlans();

    // Set up polling interval
    const intervalId = setInterval(pollPlans, interval);

    return () => clearInterval(intervalId);
  }, [callback, enabled, interval]);

  return {
    isConnected: enabled
  };
}
