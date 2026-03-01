// Plan change event management system

interface PlanChangeEvent {
  type: 'UPDATE' | 'CREATE' | 'DELETE';
  planId: string;
  planData?: any;
  timestamp: number;
  adminEmail?: string;
}

// In-memory subscribers for plan changes
const planSubscribers: Map<string, Set<(event: PlanChangeEvent) => void>> = new Map();

export function subscribeToPlans(callback: (event: PlanChangeEvent) => void): () => void {
  const allPlansKey = 'all_plans';
  
  if (!planSubscribers.has(allPlansKey)) {
    planSubscribers.set(allPlansKey, new Set());
  }
  
  planSubscribers.get(allPlansKey)!.add(callback);
  
  // Return unsubscribe function
  return () => {
    planSubscribers.get(allPlansKey)?.delete(callback);
  };
}

export function subscribeToPlan(planId: string, callback: (event: PlanChangeEvent) => void): () => void {
  if (!planSubscribers.has(planId)) {
    planSubscribers.set(planId, new Set());
  }
  
  planSubscribers.get(planId)!.add(callback);
  
  // Return unsubscribe function
  return () => {
    planSubscribers.get(planId)?.delete(callback);
  };
}

export function notifyPlanChange(event: PlanChangeEvent) {
  const allPlansKey = 'all_plans';
  
  // Notify all subscribers
  if (planSubscribers.has(allPlansKey)) {
    planSubscribers.get(allPlansKey)!.forEach(callback => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error notifying plan subscriber:', err);
      }
    });
  }
  
  // Notify specific plan subscribers
  if (planSubscribers.has(event.planId)) {
    planSubscribers.get(event.planId)!.forEach(callback => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error notifying plan subscriber:', err);
      }
    });
  }
}

export function getPlanSubscriberCount(): number {
  let total = 0;
  planSubscribers.forEach(subscribers => {
    total += subscribers.size;
  });
  return total;
}

export type { PlanChangeEvent };
