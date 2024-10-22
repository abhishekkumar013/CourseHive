import { createTransport } from 'nodemailer'

const sendMail = async (email, subject, otp) => {
  try {
    const transport = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification for Course</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #4CAF50; /* Green text */
                    }
                    p {
                        margin-bottom: 20px;
                        color: #666;
                    }
                    .otp {
                        font-size: 36px;
                        color: #007BFF; /* Blue text */
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>OTP Verification</h1>
                    <p>Hello ${email},</p>
                    <p>Thank you for signing up for our courses! Your One-Time Password (OTP) for verification is:</p>
                    <p class="otp">${otp}</p> 
                    <p>Please enter this code to complete your registration.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>We look forward to helping you learn!</p>
                </div>
            </body>
            </html>
            `


    await transport.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send OTP email.')
  }
}

export default sendMail