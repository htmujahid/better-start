import { Link, useMatchRoute } from '@tanstack/react-router'
import { AlertTriangle, Mail, Shield, Smartphone, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const navItems = [
  { to: '/home/account', label: 'Profile', icon: User, exact: true },
  { to: '/home/account/email', label: 'Email', icon: Mail },
  { to: '/home/account/security', label: 'Security', icon: Shield },
  { to: '/home/account/two-factor', label: 'Two-Factor', icon: Smartphone },
  {
    to: '/home/account/danger-zone',
    label: 'Danger Zone',
    icon: AlertTriangle,
  },
]

export function AccountNav() {
  const matchRoute = useMatchRoute()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = item.exact
          ? matchRoute({ to: item.to, fuzzy: false })
          : matchRoute({ to: item.to, fuzzy: true })

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              buttonVariants({
                variant: isActive ? 'outline' : 'ghost',
                size: 'sm',
              }),
              'justify-start gap-2',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
