import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  // Allow CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'
  const host = req.headers['host'] || 'unknown'
  const { page, referrer } = req.body || {}

  // Skip bots
  if (/bot|crawl|spider|slurp|facebook|twitter|discord|whatsapp|preview/i.test(userAgent)) {
    return res.status(200).json({ ok: true })
  }

  // Skip if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping visitor notification')
    return res.status(200).json({ ok: true })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const time = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Winnipeg',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    await transporter.sendMail({
      from: `"Site Tracker" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: `👁️ Visitor on ${host}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #2980b9; padding-bottom: 8px;">
            New Visitor Detected
          </h3>
          <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 110px;">Site</td>
              <td style="padding: 8px;">${host}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Page</td>
              <td style="padding: 8px;">${page || '/'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">IP Address</td>
              <td style="padding: 8px;">${ip}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">User-Agent</td>
              <td style="padding: 8px; font-size: 12px; word-break: break-all;">${userAgent}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Referrer</td>
              <td style="padding: 8px;">${referrer || 'direct'}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Time</td>
              <td style="padding: 8px;">${time}</td>
            </tr>
          </table>
        </div>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Track email error:', err.message)
    return res.status(200).json({ ok: true }) // fail silently to visitor
  }
}
