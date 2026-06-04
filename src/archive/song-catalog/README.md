# Archived Song Catalog Code

This directory contains the old CHUNITHM, SOUND VOLTEX, and maimai song catalog implementations.

These files were removed from the active app and should not be imported by current pages, routes, or shared components.

Keep this code as reference only for a future catalog rebuild. Future work should use a cleaner, config-driven architecture instead of reactivating these files directly.

Archived groups:

- `Page/`: old song catalog pages.
- `components/`: catalog-only filter and detail components.
- `config/`: old shared song filter configuration.
- `hooks/`: old shared song filter hook.
- `styles/`: old song catalog styles.
- `types/`: old maimai type definitions.
- `utils/`: old catalog data and filter helpers.

`src/components/SafeImage.js` and `src/utils/random.js` remain outside this archive. They are general-purpose helpers and should only be moved later if no active page or future shared code needs them.
