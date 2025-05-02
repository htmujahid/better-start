import { IconBrandGithub, IconBrandX } from '@tabler/icons-react'

export function Footer() {
  return (
    <div className="border-t py-6">
      <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-muted-fg text-sm/6 sm:text-left">
          &copy; {new Date().getFullYear()} BetterAdmin. All rights reserved.
        </p>
        <div className="sm:ml-auto">
          <FooterSocial />
        </div>
      </div>
    </div>
  )
}

const FooterSocial = () => (
  <div className="flex justify-center gap-x-6 sm:justify-end">
    <a href="https://x.com/htmujahid" className="text-muted-fg hover:text-fg">
      <span className="sr-only">X</span>
      <IconBrandX aria-hidden="true" className="size-5" />
    </a>
    <a
      href="https://github.com/htmujahid"
      className="text-muted-fg hover:text-fg"
    >
      <span className="sr-only">GitHub</span>
      <IconBrandGithub aria-hidden="true" className="size-5" />
    </a>
  </div>
)
