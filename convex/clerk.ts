import { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``

async function validateRequest(request: Request) {
    const payloadString = await request.text()

    const svixHeaders = {
        'svix-id': request.headers.get('svix-id')!,
        'svix-timestamp': request.headers.get('svix-timestamp')!,
        'svix-signature': request.headers.get('svix-signature')!,
    }
    const wh = new Webhook(webhookSecret)
    return wh.verify(payloadString, svixHeaders) as WebhookEvent
}



export const onCreateUser = httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    const data = event.data as UserJSON;
    await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        username: data.username || "",
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        about: "",
        logo: data.image_url,
    });
    console.log(data);
    return new Response(null, { status: 200 });
});