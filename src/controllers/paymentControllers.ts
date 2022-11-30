import type { NextApiRequest, NextApiResponse } from 'next';

import getRawBody from 'raw-body';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const url = require('url');

import db from '../db/db';
import { IErrorDto } from '../db/interfaces';
import Room from '../db/models/Room';
import User from '../db/models/User';
import Booking from '../db/models/Booking';

// Generate stripe checkout session  =>  /api/checkout_session/:roomId
const stripeCheckoutSession = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await db.connect();

  // Get room details
  const room = await Room.findById(req.query.roomId);

  await db.disconnect();

  const { checkInDate, checkOutDate, daysOfStay } = req.query;

  const posReferer = req.rawHeaders.findIndex((el) => el === 'Referer');
  // e.g. http://www.ming-bookit.com/rooms/62c4f68447cd36c781bbf1f0
  const urlObject = url.parse(req.rawHeaders[posReferer + 1], true);

  // Get stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${urlObject.protocol}//${urlObject.host}/bookings/me`,
    // cancel_url: `${urlObject.protocol}//${urlObject.host}/rooms/${room._id}`,
    success_url: `https://bookit-delta.vercel.app/bookings/me`,
    cancel_url: `https://bookit-delta.vercel.app/rooms/${room._id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customer_email: (req as any).user.email,
    client_reference_id: req.query.roomId,
    metadata: { checkInDate, checkOutDate, daysOfStay },
    line_items: [
      {
        name: room.name,
        images: [`${room.images[0].url}`],
        amount: parseFloat(req.query.amount as string) * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  res.status(200).json(session);
};

// Create new booking after payment  =>  /api/webhook
const webhookCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | IErrorDto>,
): Promise<void> => {
  const rawBody = await getRawBody(req);

  let isConnect = false;

  try {
    const signature = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      isConnect = true;

      await db.connect();

      const room = session.client_reference_id;
      const user = (await User.findOne({ email: session.customer_email })).id;

      const amountPaid = session.amount_total / 100;

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const checkInDate = session.metadata.checkInDate;
      const checkOutDate = session.metadata.checkOutDate;
      const daysOfStay = session.metadata.daysOfStay;

      await Booking.create({
        room,
        user,
        checkInDate,
        checkOutDate,
        daysOfStay,
        amountPaid,
        paymentInfo,
        paidAt: Date.now(),
      });

      isConnect = false;

      await db.disconnect();
      res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    if (isConnect) await db.disconnect();

    // eslint-disable-next-line no-console
    console.log('Error in Stripe Checkout Payment => ', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (error as any).message || 'Error in Stripe Checkout Payment';
    res.status(500).json({ errormsg: 'Internal Server Error', status: 500, internalServerErrorText: msg });
  }
};

export { stripeCheckoutSession, webhookCheckout };
