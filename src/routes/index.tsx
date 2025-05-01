import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Header } from '@/components/header'
import { authMiddleware } from '@/lib/auth-middleware'

const taskServerFn = createServerFn()
  .middleware([
    authMiddleware({
      permissions: {
        task: ['read'],
        user: ['ban'],
      },
    }),
  ])
  .handler(() => {
    return {
      message: 'Hello from server function',
    }
  })

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="">
      <Header />
      hello world
      <button
        onClick={async () => {
          const res = await taskServerFn()
          console.log(res)
        }}
      >
        click me
      </button>
    </div>
  )
}
