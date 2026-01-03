import Cookies from 'js-cookie'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  function toggleTheme() {
    if (
      document.documentElement.classList.contains('dark') ||
      (!Cookies.get('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.remove('dark')
      Cookies.set('theme', 'light', { expires: 365 })
    } else {
      document.documentElement.classList.add('dark')
      Cookies.set('theme', 'dark', { expires: 365 })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="size-7"
      onClick={toggleTheme}
    >
      <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
