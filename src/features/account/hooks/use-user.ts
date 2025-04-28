import { getRouteApi } from '@tanstack/react-router'

export function useUser() {
  const routeApi = getRouteApi('__root__')

  const routerContext = routeApi.useRouteContext()

  return {
    user: routerContext.user,
  }
}
