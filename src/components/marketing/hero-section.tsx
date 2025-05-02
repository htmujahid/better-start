import { IconArrowRight } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"

export function HeroSection() {
  return (
    <div>
      <div className="relative isolate flex flex-col items-center py-8 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="relative z-20 mb-4 max-w-3xl text-3xl sm:mb-6 md:text-4xl lg:text-7xl">
            Build Admin Panels with Ease
          </h1>
          <p className="max-w-2xl text-base text-fg/80 leading-relaxed sm:text-xl lg:text-2xl">
            Low-code admin panels for your next project using React, Shadcn, Tanstack, and better-auth. 
          </p>

          <div className="mt-6 flex items-center gap-x-2 sm:mt-12">
            <Link
              to="/auth/sign-up"
            >
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <a
              href="https://github.com/htmujahid/shadcn-editor"
              target="_blank"
            >
              <Button size="lg" variant="outline">
                Open Source
                <IconArrowRight />
              </Button>
            </a>
          </div>
        </div>
        <div className="relative mt-6 sm:mt-12">
          <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
            <div className="inset-ring inset-ring-fg/20 z-10 rounded-2xl bg-fg/60 p-1 sm:p-2">
              <img
                src="./cover.png"
                alt="Dashboard"
                className="rounded-lg border border-zinc-400 sm:border-zinc-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
