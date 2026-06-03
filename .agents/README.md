# Agent Role Cards

Reusable explorer role cards for this project.

Use these cards when you want to quickly spawn a read-only subagent for a specific area of the codebase. Each card includes a ready-to-copy startup prompt.

## Available Explorer Cards

- [Page and Routing Explorer](page-routing-explorer.md)
- [Components and Responsive Explorer](components-responsive-explorer.md)
- [Music Library Data Explorer](music-library-data-explorer.md)
- [Song Filter Template Explorer](song-filter-template-explorer.md)
- [Engineering and Deployment Explorer](engineering-deployment-explorer.md)

## Usage Pattern

1. Pick the card that matches the area you want to inspect.
2. Copy the startup prompt.
3. Ask Codex to spawn an `explorer` subagent with that prompt.
4. Keep the task read-only unless you intentionally create a `worker` later.

Example:

```text
请根据 .agents/page-routing-explorer.md 创建一个 explorer subagent，并让它检查第一批路由优化后的风险。
```
