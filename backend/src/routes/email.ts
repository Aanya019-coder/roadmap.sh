import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// POST /api/email/subscribe
router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, subscribed: true, updated_at: new Date().toISOString() }, { onConflict: 'email' });

    if (error) throw error;

    console.log(`[STUB] Newsletter subscription: ${email}`);
    // Email sending disabled as requested

    res.json({ success: true, data: { message: 'Subscribed successfully (Simulation)' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/unsubscribe
router.post('/unsubscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await supabase
      .from('newsletter_subscribers')
      .update({ subscribed: false })
      .eq('email', email);

    res.json({ success: true, data: { message: 'Unsubscribed' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/feedback
router.post('/feedback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, page_url, user_id } = req.body;
    const { error } = await supabase
      .from('feedback')
      .insert({ message, page_url, user_id: user_id || null });

    if (error) throw error;
    res.json({ success: true, data: { message: 'Feedback received, thank you!' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
