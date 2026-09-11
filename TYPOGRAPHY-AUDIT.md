# Typography comparison

Reviewed September 10, 2026 against the rendered original at https://www.caltechmathmeet.org/.

## Scope and method

Compared all 35 original pages with the migrated site at a 1440px browser width. Inspected computed font family, size, weight, line height, semantic heading roles, and image dimensions: 1,263 original visible text runs and 1,549 current text runs. Different run counts reflect markup, added navigation, and table organization, not word counts. Also checked every migrated page at 390px, including images, navigation, and horizontal overflow. Screenshots were visually reviewed for representative content layouts.

This is a comparison of HTML page content and image display sizes. The typography inside the original downloadable PDFs was not changed. Browser-rendered font declarations are recorded; operating systems may render the system font with slightly different glyph metrics.

## Heading and navigation follow-up

A subsequent comparison of the Problem Archive identified that retaining Georgia did not match the original heading style closely enough. The heading-family decision below supersedes the initial two-font redesign. The archive title uses the original Raleway, and year-card headings use Raleway at the original 25px. Competition detail titles use the original 45px desktop scale.

Following the user's Contact page review, standard interior titles were reduced from 72px to a 60px desktop maximum and given a consistent 500 weight, including pages that previously used 700. They scale to 36px on phones. Archive detail and TCS titles retain their smaller 45px desktop / 32px phone scale with the same 500 weight. Section headings now use a 36px desktop maximum / 28px phone size and generally 500 weight; Rules retains its original bold Bitter sections. Balanced line wrapping improves long titles. The homepage, archive card labels, body text, and navigation keep their existing treatment. All 34 interior pages were checked at 1440, 768, 390, and 320px for heading overflow and oversized body text, with no findings; all 35 pages also passed the desktop/mobile browser checks.

Original navigation and dropdown text measured 16px, compared with 13px in the first migration. Dropdown links are now 16px, panels are wider, and links have at least 44px-tall click targets. Following the user's original-header screenshot, desktop top-level labels were enlarged to 18px (17px in the compact menu) and changed to white on dark red, with vertical gold dividers and a larger gold logo. The mobile menu appears below 1181px so enlarged labels do not crowd the header. The restored header was checked at 1852, 1440, 1181, 1180, 768, 390, and 320px widths.

## Overall assessment

The original mixes Raleway, Avenir variants, Bitter variants, Sora, DIN Next, Kanit, Futura variants, and Helvetica. The current site restores Raleway for interior page titles and most headings, Bitter for the Rules, Payment Instructions, and Integration Bee section headings, and Sora for homepage headings. These three fonts are hosted locally with their licenses. Body copy, tables, and navigation retain the operating system's sans-serif font. Original Futura and Kanit subsection styles are normalized to Raleway rather than reproduced exactly.

Responsive sizing and the simpler layout remain. Heading families now follow the original much more closely, while body typography stays consistent. The first import had also removed some distinctions between headings, body copy, and emphasized instructions when stripping inline styles; those corrections remain in place.

| Content role | Original examples | Current treatment |
| --- | --- | --- |
| Page titles | Approximately 40–110px across pages | Raleway 500; most interior pages 60px at 1440px and 36px at 390px; competition detail/TCS titles 45px desktop / 32px mobile. Homepage uses Sora. |
| Section headings | Usually 28–50px; some were styled paragraphs | Raleway or Bitter according to the original page; semantic `h2`, 36px desktop / 28px mobile |
| Smaller subsections | Usually 20–40px | Raleway `h3`, 22.4px; homepage uses Sora |
| Archive year links/cards | Raleway, 25px | Raleway, 25px |
| Main navigation and dropdowns | 16px Avenir | 18px desktop / 17px compact top-level labels; 16px dropdowns; system sans-serif, wider panels and larger click targets |
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
| [Home](https://26anikar.github.io/cmm-website/) | Subsequently restored the screenshot's full-width photo banner, centered white Sora title, bold white introduction, and white photo-card headings on a gold section. Title and introduction scale down on phones. |
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
