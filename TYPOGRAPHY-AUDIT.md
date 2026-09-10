# Typography comparison

Reviewed September 10, 2026 against the rendered original at https://www.caltechmathmeet.org/.

## Scope and method

Compared all 35 original pages with the migrated site at a 1440px browser width. Inspected computed font family, size, weight, line height, semantic heading roles, and image dimensions: 1,263 original visible text runs and 1,549 current text runs. Different run counts reflect markup, added navigation, and table organization, not word counts. Also checked every migrated page at 390px, including images, navigation, and horizontal overflow. Screenshots were visually reviewed for representative content layouts.

This is a comparison of HTML page content and image display sizes. The typography inside the original downloadable PDFs was not changed. Browser-rendered font declarations are recorded; operating systems may render the system font with slightly different glyph metrics.

## Overall assessment

The new font pairing is consistent and appropriate for the simpler responsive layout selected for the migration. The original mixes Raleway, Avenir variants, Bitter variants, Sora, DIN Next, Kanit, Futura variants, and Helvetica. The new site uses Georgia for page/section headings and the operating system's sans-serif font for body copy, tables, navigation, and smaller headings.

An exact font match was not the aim of the approved redesign. The important corrections are to retain the original distinctions between headings, body copy, and emphasized instructions. The first import had removed some of those distinctions when stripping inline styles.

| Content role | Original examples | Current treatment |
| --- | --- | --- |
| Page titles | Approximately 40–110px across pages | Consistent responsive Georgia titles; interior pages 70.4px at 1440px and 43.2px at 390px |
| Section headings | Usually 28–50px; some were styled paragraphs | Semantic `h2` headings, 40px desktop / 28.8px mobile |
| Smaller subsections | Usually 20–40px | Sans-serif `h3`, 22.4px |
| Running body text | Usually 15–20px, with several oversized introductions | 17px desktop / 16px mobile; consistent family and line spacing |
| Registration date and opening period | 35px bold | 20px bold summary paragraphs, visibly distinct without competing with the title |
| Archive download links | 16px | Restored to 16px from the initial 14px table default |
| Dense results/schedule data | 14px cells | 14px cells with distinct header weights and horizontal scrolling on small screens |
| Organizer credits | Typically 17–18px in recent archives | Consistent 14px secondary text; original bold names restored where present |
| Integral images | Around 75px tall | 90px tall, preserving proportions on desktop and mobile |

## Corrections made in this review

- Restored bold, italic, and non-link underline emphasis from original inline styles without restoring inconsistent font families or arbitrary sizes.
- Restored the original emphasis on registration/payment instructions, eligibility rules, resource titles, contact information, and credited names.
- Converted schedule day labels, Discord audience labels, and the admissions session label into actual section headings.
- Converted Supplementary Material into a smaller subsection heading.
- Gave both sponsor years the same heading level beneath a single Sponsors page title.
- Increased all 17 problem archive tables to 16px, matching the original download-link size.
- Retained the earlier Guts Round paragraph, TCS/Puzzle Hunt status-note, and integral-image corrections.
- Updated the importer so these fixes survive a future re-import.

Wording and link destinations were checked against the pre-review pages. They are unchanged, apart from adding the umbrella Sponsors heading. Existing event-date inconsistencies are documented separately in `MIGRATION.md`.

## Page-by-page coverage

| Page | Result |
| --- | --- |
| [Home](https://26anikar.github.io/cmm-website/) | Hero, body introduction, card titles, and descriptions follow the new type hierarchy. |
| [Admissions events](https://26anikar.github.io/cmm-website/admissions-events/) | Restored session heading and image-credit emphasis. |
| [Contact](https://26anikar.github.io/cmm-website/contact/) | Restored emphasized contact sentence at readable body size. |
| [Discord](https://26anikar.github.io/cmm-website/discord/) | Restored Students and Coaches section headings. |
| [Faculty lecture](https://26anikar.github.io/cmm-website/faculty-lecture/) | Short title/status page; no body-font inconsistency. |
| [Friday night event](https://26anikar.github.io/cmm-website/friday-night-event/) | Short title/status page; no body-font inconsistency. |
| [Guest speaker](https://26anikar.github.io/cmm-website/guest-speaker/) | Short title/status page; no body-font inconsistency. |
| [Integration Bee](https://26anikar.github.io/cmm-website/integration-bee/) | Restored qualifier/finals emphasis; paragraphs and all three equation images remain correctly sized. |
| [Payment instructions](https://26anikar.github.io/cmm-website/payment-instructions/) | Restored selection and check-payment emphasis; labels and paragraphs remain distinct. |
| [Problem archive index](https://26anikar.github.io/cmm-website/problems/) | Consistent year-card headings; no oversized body text. |
| [2010 Fall](https://26anikar.github.io/cmm-website/problems/2010-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2010 Winter](https://26anikar.github.io/cmm-website/problems/2010-winter/) | Download table restored to 16px; title and columns reviewed. |
| [2012 Fall](https://26anikar.github.io/cmm-website/problems/2012-fall/) | Download table restored to 16px; combined-answer section reviewed. |
| [2012 Spring](https://26anikar.github.io/cmm-website/problems/2012-spring/) | Download table restored to 16px; title and columns reviewed. |
| [2013 Fall](https://26anikar.github.io/cmm-website/problems/2013-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2014 Fall](https://26anikar.github.io/cmm-website/problems/2014-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2015 Fall](https://26anikar.github.io/cmm-website/problems/2015-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2016 Fall](https://26anikar.github.io/cmm-website/problems/2016-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2017 Fall](https://26anikar.github.io/cmm-website/problems/2017-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2018 Fall](https://26anikar.github.io/cmm-website/problems/2018-fall/) | Download table restored to 16px; title and columns reviewed. |
| [2019 Fall](https://26anikar.github.io/cmm-website/problems/2019-fall/) | Download table restored to 16px; combined solutions reviewed. |
| [2020 Winter](https://26anikar.github.io/cmm-website/problems/2020-winter/) | Download table restored to 16px; title and columns reviewed. |
| [2021 Winter](https://26anikar.github.io/cmm-website/problems/2021-winter/) | Download table restored to 16px; title and columns reviewed. |
| [2022 Winter](https://26anikar.github.io/cmm-website/problems/2022-winter/) | 16px downloads; Integration Bee headings and organizer credits reviewed. |
| [2024](https://26anikar.github.io/cmm-website/problems/2024/) | 16px downloads; Integration Bee headings and organizer credits reviewed. |
| [2025](https://26anikar.github.io/cmm-website/problems/cmm-2025-problems/) | 16px downloads; Integration Bee, ceremony links, and credits reviewed. |
| [2026](https://26anikar.github.io/cmm-website/problems/cmm-2026-problems/) | 16px downloads; original bold organizer names restored; ceremony and bee sections reviewed. |
| [Puzzle Hunt](https://26anikar.github.io/cmm-website/puzzle-hunt/) | Status note stays body text; heading and download hierarchy reviewed. |
| [Registration](https://26anikar.github.io/cmm-website/registration/) | Restored date/opening-period emphasis and payment paragraph weight. |
| [Resources](https://26anikar.github.io/cmm-website/resources/) | Restored subsection hierarchy and original resource-title emphasis. |
| [Results](https://26anikar.github.io/cmm-website/results/) | All 17 year tables and headings reviewed; dense data remains 14px. |
| [Rules](https://26anikar.github.io/cmm-website/rules/) | Guts paragraph remains body text; original eligibility/round-name emphasis restored. |
| [Schedule](https://26anikar.github.io/cmm-website/scheduling/) | Restored Friday/Saturday headings; both data tables reviewed. |
| [Sponsors](https://26anikar.github.io/cmm-website/sponsors/) | Equal year headings beneath a single page title; tier and descriptive text reviewed. |
| [TCS Round](https://26anikar.github.io/cmm-website/tcs-round/) | Status stays body text; original emphasis restored; all three section headings reviewed. |

## Repeating the comparison

With Chrome installed and the local preview running, execute `node scripts/audit-typography.mjs`. It caches the original rendered measurements in `.cache/typography/` and compares them against the current build. Use `--refresh-originals` to re-read the original website. Raw measurements are kept out of the deployed site.
