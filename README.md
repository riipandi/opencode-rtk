# OpenCode RTK Plugin

[![npm version](https://img.shields.io/npm/v/opencode-rtk.svg)](https://www.npmjs.com/package/opencode-rtk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

OpenCode plugin that automatically rewrites commands to use [RTK (Rust Token Killer)](https://github.com/rtk-ai/rtk)
for token-efficient output. Reduces LLM token consumption by 60-90% on common development commands.
 RTK (Rust Token Killer) is a high-performance CLI proxy that filters and compresses command outputs before
they reach your LLM context.

## Requirements

- **Node.js >= 20.20.0**
- **RTK >= 0.27.0** - Must be installed and available in PATH
- **OpenCode** - This plugin integrates with OpenCode

## Installation

### 1. Install RTK (if not already installed)

Refer to the [RTK documentation](https://github.com/rtk-ai/rtk?tab=readme-ov-file#installation) for installation guide.

```bash
# Verify installation
rtk --version          # Should show "rtk x.x.x"
rtk gain --history     # Should show token savings stats
```

### 2. Install this plugin

Add this plugin into `opencode.json`:

```json
{
  "plugin": ["opencode-rtk"]
}
```

### 3. Verify RTK is accessible

```bash
which rtk              # Should return path to rtk binary
rtk rewrite "echo hi"  # Should return optimized command
```

## How It Works

This plugin hooks into OpenCode's `tool.execute.before` event and transparently rewrites bash/shell commands to use RTK equivalents:

```
User types:  git status
             │
       ┌─────▼──────────────────┐
       │  OpenCode + RTK Plugin │
       │  "git status"          │
       │    → "rtk git status"  │
       └─────┬──────────────────┘
             │
       ┌─────▼──────────────────┐
       │  Shell executes        │
       │  rtk git status        │
       └─────┬──────────────────┘
             │
  Claude receives: "3 modified, 1 untracked ✓"
  (instead of 50 lines of raw git output)
```

### Supported Commands

The plugin rewrites commands like:

- `git status/diff/log/add/commit/push/pull/branch` → `rtk git ...`
- `cat <file>` → `rtk read <file>`
- `rg/grep <pattern>` → `rtk grep <pattern>`
- `ls` → `rtk ls`
- `cargo test/build/clippy` → `rtk cargo ...`
- `npm/pnpm test` → `rtk test ...`
- And many more...

## Configuration

No configuration required. The plugin automatically:

1. Checks if RTK is available in PATH
2. Uses `rtk rewrite <command>` to get the optimized version
3. Falls back to original command if RTK is unavailable

### Verifying Installation

```bash
# Test that rtk rewrite works
rtk rewrite "git status"
# Output: rtk git status

# Check token savings
rtk gain
```

## Troubleshooting

### Plugin not rewriting commands?

1. Verify RTK version >= 0.27.0: `rtk --version`
2. Test rewrite manually: `rtk rewrite "git status"`
3. Check OpenCode is loading the plugin

## Related Links

- [RTK (Rust Token Killer)](https://github.com/rtk-ai/rtk) - Main CLI tool
- [OpenCode](https://opencode.ai) - AI-powered coding assistant
- [RTK Documentation](https://github.com/rtk-ai/rtk#readme) - Full RTK usage guide

## Credits

This plugin integrates [RTK](https://github.com/rtk-ai/rtk) with OpenCode. RTK is developed by the [rtk-ai](https://github.com/rtk-ai) team.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Reduce your LLM token consumption by 60-90% with RTK.*
