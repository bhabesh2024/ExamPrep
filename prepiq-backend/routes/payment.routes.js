// routes/payment.routes.js
import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../prisma/db.js';

const router = Router();

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys .env se missing hain!');
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({ error: err.message || 'Payment order create nahi ho paya.' });
  }
});

// POST /api/payment/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planDuration } = req.body;

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature !== expectedSign)
      return res.status(400).json({ error: 'Invalid signature! Payment fake ho sakti hai.' });

    const expiryDate = new Date();
    if (planDuration === '3months') expiryDate.setMonth(expiryDate.getMonth() + 3);
    else if (planDuration === '6months') expiryDate.setMonth(expiryDate.getMonth() + 6);
    else expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    if (userId) {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { isPremium: true, premiumExpiry: expiryDate },
      });
    }

    res.status(200).json({ message: 'Payment verified! You are now Premium.', premiumExpiry: expiryDate });
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ error: 'Payment verification fail ho gayi.' });
  }
});

export default router;