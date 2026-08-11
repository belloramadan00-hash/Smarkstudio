// api/send-email.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  // 1. Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get your Resend API Key from environment variables (We'll set this in Step 3)
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { fullname, email, company, service, budget, timeline, details } = req.body;

    // 3. Send the email
    const { data, error } = await resend.emails.send({
      from: 'SMARK Studio <onboarding@resend.dev>', // Keep this for testing. Change later once you buy a domain.
      to: ['belloramadan00@gmail.com'], // The email where you want to receive the message!
      subject: `New Project Inquiry from ${fullname}`,
      html: `
        <h2>New Lead Form Submission</h2>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Needed:</strong> ${service || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Details:</strong><br>${details || 'None provided'}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    // 4. Return success to your frontend
    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
