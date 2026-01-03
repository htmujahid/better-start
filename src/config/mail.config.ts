import nodemailer from 'nodemailer'

export default {
  from: process.env.MAIL_FROM || 'info@next-bard.com',
} as const

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})
