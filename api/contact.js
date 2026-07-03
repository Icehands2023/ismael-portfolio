const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, email, telefono, tipo, mensaje, _gotcha } = req.body;

  // Honeypot anti-spam — si viene relleno, fingimos éxito y no enviamos nada
  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Web Ismael Gonzalo" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Nuevo mensaje desde la web — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No indicado'}\nTipo de proyecto: ${tipo}\n\nMensaje:\n${mensaje}`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
};