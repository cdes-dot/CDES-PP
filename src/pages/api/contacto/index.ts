import type { APIRoute } from 'astro';
import { Resend } from 'resend';
export const prerender = false;
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { to, subject, message, email, phone, name } = await request.json();

   

    const data = await resend.emails.send({
      from: 'Pagina CDES <onboarding@resend.dev>',
      to: import.meta.env.EMAIL,
      subject: `${name} esta intentando contactar contigo`,
      html: `<p>${message}, desde ${email}, con el numero de telefono ${phone}</p>`,
    });

    console.log(data)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
