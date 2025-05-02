import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'

import { If } from './if'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function AppBreadcrumbs(props: {
  values?: Record<string, string>
  maxDepth?: number
}) {
  const { pathname } = useLocation()
  const splitPath = pathname.split('/').filter(Boolean)
  const values = props.values ?? {}
  const maxDepth = props.maxDepth ?? 6

  const Ellipsis = (
    <BreadcrumbItem>
      <BreadcrumbEllipsis className="h-4 w-4" />
    </BreadcrumbItem>
  )

  const showEllipsis = splitPath.length > maxDepth
  const visiblePaths = showEllipsis
    ? ([splitPath[0], ...splitPath.slice(-maxDepth + 1)] as Array<string>)
    : splitPath

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visiblePaths.map((path, index) => {
          // const label =
          //   path in values ? (
          //     values[path]
          //   ) : (
          //     <Trans
          //       i18nKey={`common:routes.${unslugify(path)}`}
          //       defaults={unslugify(path)}
          //     />
          //   )

          const label = values[path] ?? path

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className={'capitalize lg:text-xs'}>
                <If
                  condition={index < visiblePaths.length - 1}
                  fallback={label}
                >
                  <Link
                    to={
                      '/' +
                      splitPath.slice(0, splitPath.indexOf(path) + 1).join('/')
                    }
                  >
                    {label}
                  </Link>
                </If>
              </BreadcrumbItem>

              {index === 0 && showEllipsis && (
                <>
                  <BreadcrumbSeparator />
                  {Ellipsis}
                </>
              )}

              <If condition={index !== visiblePaths.length - 1}>
                <BreadcrumbSeparator />
              </If>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
