// WhatsApp notification helper (CallMeBot free API)
// Activates only when WHATSAPP_APIKEY is set in Render env vars.

const https = require('https');
const http = require('http');

async function sendWhatsApp(text) {
  const apikey = process.env.WHATSAPP_APIKEY;
  const phone = process.env.WHATSAPP_PHONE;
  if (!apikey || !phone) {
    console.log('[whatsapp] Not configured (WHATSAPP_APIKEY / WHATSAPP_PHONE missing)');
    return { skipped: true };
  }

  const msg = encodeURIComponent(text);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${msg}&apikey=${apikey}`;

  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        console.log('[whatsapp] Sent. Response:', body.slice(0, 200));
        resolve({ sent: true, body });
      });
    });
    req.on('error', (e) => {
      console.error('[whatsapp] Error:', e.message);
      resolve({ sent: false, error: e.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ sent: false, error: 'timeout' });
    });
  });
}

// Build a clean notification message
function studentMsg(s) {
  return `🔔 NEW STUDENT LOGIN\n━━━━━━━━━━━━\n👤 Name: ${s.name}\n📱 Phone: ${s.phone}${s.course ? '\n📚 Course: ' + s.course : ''}\n🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n━━━━━━━━━━━━\nCheck the admin panel for full details.`;
}

function paymentMsg(p) {
  return `💰 FEE PAYMENT SUBMITTED\n━━━━━━━━━━━━\n👤 Name: ${p.name}\n📱 Phone: ${p.phone}${p.course ? '\n📚 Course: ' + p.course : ''}${p.amount ? '\n💵 Amount: ₹' + p.amount : ''}${p.transaction_id ? '\n🧾 Txn ID: ' + p.transaction_id : ''}\n🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n━━━━━━━━━━━━\nVerify in admin panel.`;
}

function demoMsg(b) {
  return `🎓 DEMO CLASS BOOKED\n━━━━━━━━━━━━\n👤 Name: ${b.name}\n📱 Phone: ${b.phone}${b.course ? '\n📚 Course: ' + b.course : ''}${b.preferred_date ? '\n📅 Date: ' + b.preferred_date : ''}${b.preferred_time ? '\n⏰ Time: ' + b.preferred_time : ''}${b.message ? '\n💬 ' + b.message : ''}\n🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n━━━━━━━━━━━━\nCheck admin panel.`;
}

function enquiryMsg(e) {
  return `📩 NEW ENQUIRY${e.enquiry_type && e.enquiry_type !== 'general' ? ' (' + e.enquiry_type + ')' : ''}\n━━━━━━━━━━━━\n👤 Name: ${e.name}\n📱 Phone: ${e.phone}${e.course ? '\n📚 Course: ' + e.course : ''}${e.message ? '\n💬 ' + e.message : ''}\n🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n━━━━━━━━━━━━\nCheck admin panel.`;
}

module.exports = { sendWhatsApp, studentMsg, paymentMsg, demoMsg, enquiryMsg };
