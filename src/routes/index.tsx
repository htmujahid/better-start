import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/header'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="">
      <Header />
      hello world
    </div>
  )
}
