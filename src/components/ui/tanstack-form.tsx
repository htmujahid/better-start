/**
 * Credits
 * name: Aryan Chaurasia
 * url: https://github.com/kulterryan/shadcn-tanstack-form/blob/main/src/components/ui/tanstack-form.tsx
 */

'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import type * as LabelPrimitive from '@radix-ui/react-label'
import type { FieldApi, FormApi } from '@tanstack/react-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

// Form component
const Form = React.forwardRef<
  HTMLFormElement,
  {
    form: FormApi<any, any, any, any, any, any, any, any, any, any>
    children: React.ReactNode
  } & React.HTMLAttributes<HTMLFormElement>
>(({ form, children, ...props }, ref) => {
  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      {...props}
    >
      {children}
    </form>
  )
})
Form.displayName = 'Form'

// Context for tracking form field
type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

// Field component to connect TanStack Form fields
interface FormFieldProps {
  name: string
  form: FormApi<any, any, any, any, any, any, any, any, any, any>
  children: React.ReactNode
}

function FormField({ name, children }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}

// Hook to get form field context and state
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

// Context for form items
type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

// FormItem component
function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

// FormLabel component
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      className={cn(className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

// FormControl component
interface FormControlProps extends React.ComponentProps<typeof Slot> {
  fieldApi?: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
}

function FormControl({ fieldApi, ...props }: FormControlProps) {
  const { formItemId, formDescriptionId, formMessageId } = useFormField()

  const hasError = !!fieldApi?.state.meta.errors?.length

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !hasError
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={hasError}
      {...props}
    />
  )
}

// FormDescription component
function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

// FormMessage component
interface FormMessageProps extends React.ComponentProps<'p'> {
  fieldApi?: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
}

function FormMessage({ className, fieldApi, ...props }: FormMessageProps) {
  const { formMessageId } = useFormField()

  // Get error message from fieldApi if available
  let errorMessage = fieldApi?.state.meta.errors?.[0]

  // Improve error handling to extract message from various error formats
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      // Already a string, use it directly
    } else if (errorMessage === null || errorMessage === undefined) {
      errorMessage = undefined // Clear the error message
    } else if (typeof errorMessage === 'object') {
      // Try to extract a message property or convert to string
      if (errorMessage.message) {
        errorMessage = String(errorMessage.message)
      } else if (
        errorMessage.toString &&
        errorMessage.toString() !== '[object Object]'
      ) {
        errorMessage = errorMessage.toString()
      } else {
        // Last resort fallback
        errorMessage = 'Validation failed'
      }
    } else {
      // Fallback for any other type
      errorMessage = String(errorMessage)
    }
  }

  const body = errorMessage ? errorMessage : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
