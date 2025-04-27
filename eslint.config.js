//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [], "ignoreOnInitialization": false }]
  }
]
