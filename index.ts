/**
 * RTK OpenCode plugin — rewrites commands to use rtk for token savings.
 * Requires: rtk >= 0.27.0 in PATH.
 */

import type { Plugin } from "@opencode-ai/plugin"

let rtkAvailable: boolean | null = null

export const RTKPlugin: Plugin = async ({ $ }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash" && input.tool !== "shell") return

      const command = output.args?.command
      if (typeof command !== "string" || !command) return

      if (rtkAvailable === null) {
        try {
          await $`which rtk`.quiet()
          rtkAvailable = true
        } catch {
          rtkAvailable = false
        }
      }

      if (!rtkAvailable) return

      try {
        const result = await $`rtk rewrite ${command}`.quiet().nothrow()
        const rewritten = String(result.stdout).trim()
        if (rewritten && rewritten !== command) {
          output.args.command = rewritten
        }
      } catch {
        // pass through unchanged
      }
    },
  }
}

export default RTKPlugin
