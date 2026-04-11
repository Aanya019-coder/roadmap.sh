import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Stub for now as requested
    res.json({ 
      success: true, 
      data: { 
        url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
        message: "Stripe is disabled for now. Click to simulate upgrade." 
      } 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payments/webhook
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  // Stub for now
  res.json({ received: true });
});

// GET /api/payments/subscription
router.get('/subscription', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, stripe_subscription_id')
      .eq('id', req.user!.id)
      .single();

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
