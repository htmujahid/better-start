'use client'

import * as React from 'react'
import { useRouter } from '@tanstack/react-router'

import { searchCommandData } from './sidebar/sidebar-data'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useAccessControl } from '@/features/account/hooks/use-access-control'

export function SearchCommandDialog({
  children,
}: {
  children: (props: {
    open: boolean
    setOpen: (open: boolean) => void
  }) => React.ReactNode
}) {
  const { hasPermission, hasRole } = useAccessControl()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const filteredData = Object.entries(searchCommandData).filter(
    ([_, value]) => {
      return value.every((item) => {
        if (item.permission && !hasPermission(item.permission)) {
          return false
        }
        if (item.role && !hasRole(item.role)) {
          return false
        }
        return true
      })
    },
  )

  return (
    <Command>
      {children({
        open,
        setOpen,
      })}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredData.map(([key, value], index) => {
            return (
              <React.Fragment key={key}>
                {index !== 0 && <CommandSeparator />}
                <CommandGroup heading={key}>
                  {value.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                      return null
                    }
                    if (item.role && !hasRole(item.role)) {
                      return null
                    }
                    return (
                      <CommandItem
                        key={item.title}
                        disabled={item.disabled}
                        onSelect={() => {
                          router.navigate({ to: item.url })
                          setOpen(false)
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            )
          })}
        </CommandList>
      </CommandDialog>
    </Command>
  )
}
