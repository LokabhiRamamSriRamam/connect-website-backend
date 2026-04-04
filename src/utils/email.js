import nodemailer from "nodemailer";

// Transporter is created lazily so dotenv has already loaded the env vars by the time
// the first email is sent (ESM imports are hoisted before dotenv.config() runs).
let _transporter = null;
const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
};

export const sendContactLeadNotification = async (lead) => {
  const transporter = getTransporter();
  const timeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:#ca8a04;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700">New Contact Form Submission</h2>
        <p style="color:#fef9c3;margin:4px 0 0;font-size:13px">Connect Gen AI — Get In Touch Form</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151;width:140px">Name</td>
            <td style="padding:10px 8px;color:#111827">${lead.name || "—"}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Email</td>
            <td style="padding:10px 8px;color:#111827">${lead.email || "—"}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Phone</td>
            <td style="padding:10px 8px;color:#111827">${lead.phone || "—"}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Message</td>
            <td style="padding:10px 8px;color:#111827;white-space:pre-wrap">${lead.message || "—"}</td>
          </tr>
          <tr>
            <td style="padding:10px 8px;font-weight:600;color:#374151">Time (IST)</td>
            <td style="padding:10px 8px;color:#111827">${timeIST}</td>
          </tr>
        </table>
      </div>
      <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#6b7280">Get In Touch Form · Connect Gen AI · Auto-generated notification</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Connect Gen AI Leads" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAILS,
    subject: `New Contact: ${lead.name || "Unknown"} — ${lead.email || lead.phone || "No contact"}`,
    html,
  });
};

export const sendSaarthiLeadNotification = async (user) => {
  const transporter = getTransporter();
  const timeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:#7c3aed;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700">New Saarthi Smart Report Lead</h2>
        <p style="color:#ddd6fe;margin:4px 0 0;font-size:13px">Connect Gen AI — Lead Notification</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151;width:140px">Name</td>
            <td style="padding:10px 8px;color:#111827">${user.name}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Mobile</td>
            <td style="padding:10px 8px;color:#111827">${user.mobile}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Email</td>
            <td style="padding:10px 8px;color:#111827">${user.email || "—"}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Designation</td>
            <td style="padding:10px 8px;color:#111827">${user.designation}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Company</td>
            <td style="padding:10px 8px;color:#111827">${user.companyName}</td>
          </tr>
          <tr>
            <td style="padding:10px 8px;font-weight:600;color:#374151">Time (IST)</td>
            <td style="padding:10px 8px;color:#111827">${timeIST}</td>
          </tr>
        </table>
      </div>
      <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#6b7280">Saarthi Smart Report · Connect Gen AI · Auto-generated notification</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Saarthi Leads · Connect Gen AI" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAILS,
    subject: `New Saarthi Lead: ${user.name} (${user.companyName})`,
    html,
  });
};
