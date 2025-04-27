import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/origin-ui/alert'

export function AuthSuccess({ message }: { message: string }) {
  return (
    <Alert variant={'success'}>
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
