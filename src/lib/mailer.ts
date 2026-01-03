import mailConfig, { transporter } from '@/config/mail.config'

type SendMailOptions = {
  to: string | Array<string>
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendMail({
  to,
  subject,
  html,
  text,
  from = mailConfig.from,
}: SendMailOptions) {
  const info = await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    text,
  })

  return info
}
