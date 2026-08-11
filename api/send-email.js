const { Resend } = require('resend');

// This console log will prove to us that Vercel can actually run the file
console.log(">>> Vercel API function loaded successfully!");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { fullname, email, company, service, budget, timeline, details, projectType, pages, tier, addons, estimatedPrice } = req.body;

    const emailHtml = `
      <h2>New Project Inquiry</h2>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Service/Type:</strong> ${service || projectType || 'N/A'}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      ${pages ? `<p><strong>Pages:</strong> ${pages}</p>` : ''}
      ${tier ? `<p><strong>Design Tier:</strong> ${tier}</p>` : ''}
      ${addons ? `<p><strong>Add-ons:</strong> ${addons.join(', ')}</p>` : ''}
      ${estimatedPrice ? `<p><strong>Estimated Price:</strong> ${estimatedPrice}</p>` : ''}
      <p><strong>Details:</strong><br>${details || 'None provided'}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SMARK Studio <onboarding@resend.dev>',
      to: ['belloramadan00@gmail.com'],
      subject: `New Inquiry from ${fullname}`,
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
