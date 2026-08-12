const { Resend } = require('resend');

console.log(">>> Vercel API function loaded successfully!");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { fullname, email, company, service, budget, timeline, details } = req.body;

    const emailHtml = `
      <h2>New Project Inquiry</h2>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Service:</strong> ${service || 'N/A'}</p>
      <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
      <p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
      <p><strong>Details:</strong><br>${details || 'None provided'}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SMARK Studio <onboarding@resend.dev>',
      to: ['belloramadan00@gmail.com'],
      subject: `New Consultation from ${fullname}`,
      html: emailHtml,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
