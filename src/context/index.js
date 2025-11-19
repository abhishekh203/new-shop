/**
 * Context Barrel Export
 * 
 * Centralized exports for all React Context providers and hooks.
 * This allows for cleaner imports like:
 * import { MyContext, MyState, useNotification } from '@context';
 */

// Main application context
export { default as MyContext } from './myContext';
export { default as MyState } from './myState';

// Notification context
export { 
  NotificationProvider, 
  useNotification 
} from './NotificationContext';
