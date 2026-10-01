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
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    });
  }
  return _transporter;
};

// Form input goes into an HTML email — never interpolate it raw.
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Header values must not carry line breaks.
const oneLine = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();

// Each service's own qualifying questions — kept in sync with SERVICE_QUESTIONS in
// frontend/src/pages/get-in-touch.jsx. Returns only the rows that apply to this lead's service.
const SERVICE_ROW_FIELDS = {
  "Screen Bazaar (digital signage)": [
    ["Screen", "screenSource"],
    ["Screen type", "screenKind"],
    ["Locations", "scale"],
    ["Screens", "screens"],
  ],
  "Vital.AI": [
    ["Specialty", "specialty"],
    ["Clinicians", "clinicians"],
  ],
  "Molaris.AI": [["Chairs", "chairs"]],
  "Nexus CRM": [
    ["Sales team size", "teamSize"],
    ["Leads per month", "leadVolume"],
  ],
  "Saarthi AI": [["Business type", "businessType"]],
  "Saarthi for Contractors": [
    ["Workers", "workers"],
    ["Sites", "sites"],
  ],
  "Beauty Manager": [
    ["Salon/spa", "salonType"],
    ["Stylists", "stylists"],
    ["Branches", "branches"],
  ],
};

const serviceRows = (lead) =>
  (SERVICE_ROW_FIELDS[lead.service] || []).map(([label, field]) => [label, lead[field]]);

export const sendContactLeadNotification = async (lead) => {
  const transporter = getTransporter();
  const timeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows = [
    ["Name", lead.name],
    ["Business", lead.businessName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", lead.city],
    ["Interested in", lead.service],
    ["Industry", lead.industry],
    ...serviceRows(lead),
    ["Message", lead.message],
    ["Time (IST)", timeIST],
  ];

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(328deg,#1F30A0 19%,#914BFA 81%);background-color:#4B3FD0;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700">New Contact Form Submission</h2>
        <p style="color:#eee5ff;margin:4px 0 0;font-size:13px">Screen Bazaar — Contact Us form</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value], i) => `
          <tr${i < rows.length - 1 ? ' style="border-bottom:1px solid #f3f4f6"' : ""}>
            <td style="padding:10px 8px;font-weight:600;color:#374151;width:140px;vertical-align:top">${label}</td>
            <td style="padding:10px 8px;color:#111827;white-space:pre-wrap">${esc(value) || "—"}</td>
          </tr>`
            )
            .join("")}
        </table>
      </div>
      <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#6b7280">Contact Us · Screen Bazaar by Connect Gen AI · Auto-generated notification</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Screen Bazaar Leads" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAILS,
    ...(lead.email ? { replyTo: oneLine(lead.email) } : {}),
    subject: oneLine(
      `New Contact: ${lead.name || "Unknown"}${lead.businessName ? ` (${lead.businessName})` : ""} — ${lead.phone || lead.email || "No contact"}`
    ),
    html,
  });
};

export const sendContactCustomerConfirmation = async (lead) => {
  const transporter = getTransporter();
  const firstName = oneLine(lead.name).split(" ")[0] || "there";
  const isSB = (lead.service || "").startsWith("Screen Bazaar");
  const brand = isSB ? "Screen Bazaar" : "Connect Gen AI";

  const rows = [
    ["Interested in", lead.service],
    ["Business", lead.businessName],
    ["City", lead.city],
    ...serviceRows(lead),
    ["Your message", lead.message],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(328deg,#1F30A0 19%,#914BFA 81%);background-color:#4B3FD0;padding:20px 24px">
        <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700">Thanks for reaching out, ${esc(firstName)}!</h2>
        <p style="color:#eee5ff;margin:4px 0 0;font-size:13px">${esc(brand)} · Connect Gen AI</p>
      </div>
      <div style="padding:24px;color:#111827;font-size:15px;line-height:1.5">
        <p style="margin:0 0 12px">We've received your enquiry${lead.service ? ` about <b>${esc(lead.service)}</b>` : ""}. Someone from our team will call you${lead.phone ? ` on <b>${esc(lead.phone)}</b>` : ""} within 24 hours.</p>
        ${
          rows.length
            ? `<p style="margin:16px 0 6px;font-weight:600;color:#374151">What you told us</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) => `
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:8px;font-weight:600;color:#374151;width:140px;vertical-align:top">${label}</td>
            <td style="padding:8px;white-space:pre-wrap">${esc(value)}</td>
          </tr>`
            )
            .join("")}
        </table>`
            : ""
        }
        <p style="margin:16px 0 0">Need us sooner? Call or WhatsApp +91 99673 92920, or just reply to this email.</p>
      </div>
      <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#6b7280">${esc(brand)} by Connect Gen AI · This is an automated confirmation</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${brand} · Connect Gen AI" <${process.env.SMTP_USER}>`,
    to: oneLine(lead.email),
    subject: oneLine(`We've received your enquiry — ${brand}`),
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
            <td style="padding:10px 8px;color:#111827">${esc(user.name)}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Mobile</td>
            <td style="padding:10px 8px;color:#111827">${esc(user.mobile)}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Email</td>
            <td style="padding:10px 8px;color:#111827">${esc(user.email) || "—"}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Designation</td>
            <td style="padding:10px 8px;color:#111827">${esc(user.designation)}</td>
          </tr>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:10px 8px;font-weight:600;color:#374151">Company</td>
            <td style="padding:10px 8px;color:#111827">${esc(user.companyName)}</td>
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
