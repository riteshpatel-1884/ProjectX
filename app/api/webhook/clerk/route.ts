import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, phone_numbers } = evt.data;

    try {
      await prisma.user.create({
        data: {
          id: id,
          email: email_addresses[0]?.email_address || '',
          phoneNumber: phone_numbers?.[0]?.phone_number || null,
        },
      });

      console.log('✅ User created in database:', id);
      return NextResponse.json({ success: true, userId: id });
    } catch (error) {
      console.error('❌ Error creating user in database:', error);
      return NextResponse.json(
        { error: 'Failed to create user in database' },
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, phone_numbers } = evt.data;

    try {
      await prisma.user.update({
        where: { id: id },
        data: {
          email: email_addresses[0]?.email_address || '',
          phoneNumber: phone_numbers?.[0]?.phone_number || null,
        },
      });

      console.log('✅ User updated in database:', id);
      return NextResponse.json({ success: true, userId: id });
    } catch (error) {
      console.error('❌ Error updating user in database:', error);
      // Don't return error, just log it
      return NextResponse.json({ success: true, userId: id });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { id: id as string },
      });

      console.log('✅ User deleted from database:', id);
      return NextResponse.json({ success: true, userId: id });
    } catch (error) {
      console.error('❌ Error deleting user from database:', error);
      // Don't return error, just log it
      return NextResponse.json({ success: true, userId: id });
    }
  }

  return NextResponse.json({ success: true });
}