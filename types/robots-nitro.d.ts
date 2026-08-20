import type { RobotsValue } from '@nuxtjs/robots'

type RobotsRouteRule = RobotsValue | {
  indexable: boolean
  rule: string
}

declare module 'nitropack/types' {
  interface NitroRouteRules {
    robots?: RobotsRouteRule
  }
  interface NitroRouteConfig {
    robots?: RobotsRouteRule
  }
}

declare module 'nitropack' {
  interface NitroRouteRules {
    robots?: RobotsRouteRule
  }
  interface NitroRouteConfig {
    robots?: RobotsRouteRule
  }
}

export {}
