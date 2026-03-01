import { subscribeToPlans, type PlanChangeEvent } from '@/lib/planSync';
import { NextResponse } from 'next/server';

// Store active SSE connections
const activeConnections = new Set<ReadableStreamDefaultController>();

export function GET() {
  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      activeConnections.add(controller);
      
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Connected to plan updates' })}\n\n`);
      
      // Subscribe to plan changes
      const unsubscribe = subscribeToPlans((event: PlanChangeEvent) => {
        try {
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        } catch (err) {
          console.error('Error sending SSE:', err);
        }
      });
      
      // Clean up on connection close
      return () => {
        unsubscribe();
        activeConnections.delete(controller);
      };
    }
  });
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// For edge runtime compatibility, we also support a polling-based approach
export async function POST(req: Request) {
  try {
    const { action, count } = await req.json();
    
    if (action === 'get-active-connections') {
      return NextResponse.json({ activeConnections: activeConnections.size });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
