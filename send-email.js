const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const data = req.body || {};

    const {
      fullname,
      email,
      company,
      service,
      budget,
      timeline,
      details,

      // Consultation-specific fields
      current_site,

      // Get Quote-specific fields
      projectType,
      pages,
      tier,
      addons,
      estimatedPrice
    } = data;

    // Basic validation
    if (!fullname || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required.'
      });
    }

    // Build the email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New SMARK Studio Inquiry</h2>

        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>

        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        ${current_site ? `<p><strong>Current Website:</strong> ${current_site}</p>` : ''}

        ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
        ${pages ? `<p><strong>Pages:</strong> ${pages}</p>` : ''}
        ${tier ? `<p><strong>Package:</strong> ${tier}</p>` : ''}
        ${estimatedPrice ? `<p><strong>Estimated Price:</strong> ${estimatedPrice}</p>` : ''}

        ${
          addons && Array.isArray(addons) && addons.length
            ? `<p><strong>Add-ons:</strong> ${addons.join(', ')}</p>`
            : ''
        }

        <h3>Project Details</h3>
        <p>${details || 'No additional details provided.'}</p>

        <hr>

        <p style="color:#666;font-size:12px;">
          Sent from the SMARK Studio website.
        </p>
      </div>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'SMARK Studio <onboarding@resend.dev>',
      to: ['belloramadan00@gmail.com'],
      reply_to: email,
      subject: `New SMARK Studio Inquiry from ${fullname}`,
      html: emailHtml
    });

    // Resend returned an error
    if (error) {
      console.error('Resend error:', error);

      return res.status(500).json({
        success: false,
        error: error.message || 'Resend failed to send the email.'
      });
    }

    console.log('Email sent successfully:', emailData);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully.'
    });

  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong on the server.'
    });
  }
};
