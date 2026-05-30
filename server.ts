import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Stripe Checkout
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { items } = req.body; // Expecting an array of items with { name, price, quantity }
      
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        return res.status(500).json({ error: 'Stripe Secret Key is not configured' });
      }

      const stripe = new Stripe(stripeKey, {
        apiVersion: '2026-05-27.dahlia' as any
      });

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      }));

      // The APP_URL is injected by AI Studio. We'll use it for redirection after checkout.
      const domainURL = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${domainURL}/success`,
        cancel_url: `${domainURL}/cart`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
