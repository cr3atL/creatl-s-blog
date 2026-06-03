# Refactor Plan: Personal Homepage + Tool Site

Use this ASCII version if Chinese Markdown is displayed as mojibake in a new Codex thread.

## Project Direction

The project should be refactored toward a personal homepage plus tool site.
It is not just a music-game catalog site.

The three existing song catalog pages should be removed from the active app for now.
They may be rebuilt later with a cleaner architecture.

Pages to remove from active routing:

```txt
/chunithm-songs
/sdvx-songs
/maimai-songs
```

## Current High-Level Problems

1. The app is called a blog, but the current feature set is closer to a personal homepage plus tools.
2. The three song catalog pages are heavy and duplicated.
3. The maimai catalog uses a separate filter system from CHUNITHM and SDVX.
4. Navigation is too crowded.
5. The homepage mixes personal content and feature cards without a clear structure.
6. Many Chinese strings appear as mojibake in source or terminal output.
7. Some unfinished pages, such as articles and race signup, do not form complete user flows.

## Main Goals For This Refactor

1. Reposition the app as a personal homepage plus tool site.
2. Remove active routes and navigation entries for the three song catalogs.
3. Remove song catalog cards and navigation actions from the homepage.
4. Add or prepare a clear tools entry, preferably `/tools`.
5. Keep existing non-catalog tools available:
   - random image page
   - race signup page
6. Fix visible mojibake in the active app.
7. Keep changes scoped. Do not rebuild the song catalogs in this round.

## Non-Goals

Do not do these in this round:

1. Do not rebuild CHUNITHM, SDVX, or maimai catalogs.
2. Do not add login, database, admin panel, or CMS.
3. Do not migrate the whole app to Vite, Next.js, or full TypeScript.
4. Do not do a large dependency overhaul unless required for build correctness.
5. Do not delete user changes or run destructive git commands.

## Recommended Strategy

Use "disable in active app first, archive later".

Minimum safe approach:

1. Remove catalog imports and routes from `src/App.js`.
2. Remove catalog navigation entries from `src/components/navItems.js`.
3. Remove catalog feature cards and click handlers from `src/Page/Home.js`.
4. Keep old catalog files temporarily if moving them creates too much risk.
5. Ensure old catalog URLs fall through to the 404 page.

Optional archive approach:

Move old catalog-only files to:

```txt
src/archive/song-catalog/
```

Add:

```txt
src/archive/song-catalog/README.md
```

Explain that these files are old catalog implementations, removed from the active app, and should only be used as reference for a future rebuild.

## Suggested New Information Architecture

Recommended active routes:

```txt
/              Home
/home          Optional home alias
/article       Articles
/tools         Tools index
/randomssiba   Random image tool, can stay as legacy route
/race-signon   Race signup tool, can stay as legacy route
/about         About
*              404
```

Recommended top navigation:

```txt
Home
Articles
Tools
About
```

The tools page can link to:

```txt
Random Image
Race Signup
Future Tools
```

## Subagent Plan

Use subagents before editing.

### Subagent A: Routing and References

Read-only task.

Inspect:

```txt
src/App.js
src/components/navItems.js
src/Page/Home.js
src/App.test.js
README.md
```

Report:

1. Where the three catalog routes are registered.
2. Where catalog links or cards are shown.
3. Which imports become unused after removal.
4. Whether tests depend on old route or text content.

### Subagent B: Layout and Visual System

Read-only task.

Inspect:

```txt
src/components/AppShell.js
src/components/Layout.js
src/components/MobileLayout.js
src/components/ResponsiveLayout.js
src/components/navItems.js
src/styles/tokens.css
src/styles/shell.css
src/styles/page.css
src/styles/responsive.css
```

Report:

1. Current layout problems.
2. Navigation simplification suggestions.
3. Mobile drawer improvements.
4. Reusable page layout recommendations.
5. Active-app mojibake locations.

### Subagent C: Catalog Archive Scope

Read-only task.

Inspect catalog-related files.

Catalog-only candidates:

```txt
src/Page/ChunithmSongs.js
src/Page/SdvxSongs.js
src/Page/MaimaiSongs.js
src/components/MaimaiFilter.js
src/components/SongFilterModal.js
src/components/NoteDetailModal.js
src/hooks/useSongFilters.js
src/config/songFilterConfigs.js
src/utils/maimaiData.js
src/utils/maimaiFilters.js
src/utils/genericSongFilters.js
src/types/maimai.ts
src/styles/song-pages.css
```

Possibly reusable:

```txt
src/components/SafeImage.js
src/utils/random.js
```

Report:

1. Which files are safe to archive.
2. Which files should remain because active pages still use them.
3. Whether archiving is safe now or should be postponed.

## Implementation Phases

### Phase 0: Protect the Worktree

1. Run `git status --short`.
2. Identify existing uncommitted changes.
3. Do not run destructive commands.
4. Do not revert user changes.
5. If unclear, ask before editing.

Acceptance:

1. Worktree state is understood.
2. No user edits are overwritten.

### Phase 1: Disable Song Catalogs In Active App

Edit:

```txt
src/App.js
src/components/navItems.js
src/Page/Home.js
```

Actions:

1. Remove catalog page imports from `src/App.js`.
2. Remove catalog routes from `src/App.js`.
3. Remove catalog nav items from `src/components/navItems.js`.
4. Remove catalog feature cards and handlers from `src/Page/Home.js`.
5. Keep old catalog files untouched unless archiving is explicitly chosen.

Acceptance:

1. Navigation no longer shows CHUNITHM, SDVX, or maimai.
2. Homepage no longer shows song catalog feature cards.
3. Old catalog paths go to 404.
4. No unused imports remain in touched files.

### Phase 2: Add Tools Entry

Preferred:

1. Add a `/tools` route.
2. Add `src/Page/Tools.js`.
3. Link current tools:
   - Random image
   - Race signup
4. Add Tools to top navigation.
5. Add a concise tools section on the homepage.

Acceptance:

1. User can open `/tools`.
2. User can navigate from `/tools` to existing tools.
3. Top navigation remains short and readable.

### Phase 3: Fix Active-App Text Mojibake

Fix visible text in active files, especially:

```txt
src/components/navItems.js
src/components/AppShell.js
src/components/MobileLayout.js
src/components/ResponsiveLayout.js
src/Page/Home.js
src/Page/Article.js
src/Page/About.js
src/Page/Randomssiba.js
src/Page/RaceSignon.js
src/Page/NotFound.js
```

Use clear Chinese text if the project uses Chinese UI.

Acceptance:

1. Active navigation labels are readable.
2. Page titles and button labels are readable.
3. Footer text is readable.
4. Files are saved as UTF-8.

### Phase 4: Unify Page Layout

Use existing style direction:

```txt
src/styles/tokens.css
src/styles/page.css
src/styles/shell.css
```

Actions:

1. Use consistent page containers.
2. Reduce inline styles where easy.
3. Improve mobile drawer width to something like `min(320px, 86vw)`.
4. Keep the visual style calmer and easier to read.

Acceptance:

1. Home, Articles, Tools, About, Random Image, Race Signup, and 404 feel like one site.
2. Mobile navigation is readable.
3. Main content is easier to scan.

### Phase 5: Optional Archive

Only do this after active app builds.

Actions:

1. Create `src/archive/song-catalog/`.
2. Move old catalog-only files there if safe.
3. Add archive README.
4. Ensure active app does not import archive files.

Acceptance:

1. Build still passes.
2. Old code is preserved as reference.
3. Active app is not coupled to archive files.

## Validation

Run:

```txt
npm run build
```

Manual route checks:

```txt
/
/article
/tools
/randomssiba
/race-signon
/about
/chunithm-songs
/sdvx-songs
/maimai-songs
/some-missing-page
```

Expected:

1. Main active pages are readable.
2. Tools page works.
3. Old song catalog paths go to 404.
4. Navigation is short.
5. Build succeeds.

## Suggested Prompt For A New Codex Thread

Use this exact prompt in a new thread:

```txt
Please read `.agents/refactor-personal-tool-site-plan.ascii.md` and execute the refactor plan.

Important:
- Use subagents first, as described in the plan.
- Do not use the Chinese plan file if it displays as mojibake.
- First inspect `git status --short`.
- Do not overwrite or revert user changes.
- Implement Phase 1 through Phase 3 first.
- Keep the old song catalog files untouched unless archiving is clearly safe.
- Do not rebuild the song catalogs in this round.
- After implementation, run `npm run build` and report the result.
```

