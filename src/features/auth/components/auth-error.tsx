import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function AuthError({ error }: { error: string }) {
  return (
    <Alert variant={'error'}>
      <AlertCircle />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
