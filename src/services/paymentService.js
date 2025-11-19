import { supabase } from '../supabase/supabaseConfig';
import logger from '../utils/logger';

/**
 * Fetch secure payment methods from database
 * @returns {Promise<Object>} Payment methods object
 */
export const fetchPaymentMethods = async () => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to view payment methods');
    }

    // Fetch payment methods from database
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching payment methods:', { error: error.message });
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No payment methods available');
    }

    // Transform to the format expected by the component
    const paymentMethods = {};
    
    data.forEach(method => {
      paymentMethods[method.method_key] = {
        qr: method.qr_image_path,
        number: method.payment_number,
        color: method.color,
        name: method.name,
        icon: method.icon,
        bgColor: method.bg_color,
        textColor: method.text_color,
        borderColor: method.border_color,
        description: method.description,
        features: Array.isArray(method.features) ? method.features : []
      };
    });

    // Log access for security auditing
    logger.info('Payment methods accessed', { 
      userId: user.id, 
      timestamp: new Date().toISOString() 
    });

    return paymentMethods;
  } catch (error) {
    logger.error('Failed to fetch payment methods:', { 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
};

/**
 * Verify payment method integrity
 * @param {string} methodKey - Payment method key
 * @returns {Promise<boolean>}
 */
export const verifyPaymentMethod = async (methodKey) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('method_key')
      .eq('method_key', methodKey)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      logger.error('Error verifying payment method:', { error: error.message });
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error('Payment method verification failed:', { error: error.message });
    return false;
  }
};

/**
 * Admin function: Update payment method
 * Only accessible by admin users
 */
export const updatePaymentMethod = async (methodKey, updates) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || userData?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('method_key', methodKey)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info('Payment method updated by admin', { 
      methodKey, 
      adminId: user.id 
    });

    return data;
  } catch (error) {
    logger.error('Failed to update payment method:', { error: error.message });
    throw error;
  }
};

