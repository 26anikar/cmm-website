# Migration record

Source: https://www.caltechmathmeet.org/

Imported: September 10, 2026. Destination: https://26anikar.github.io/cmm-website/

## Coverage

- All 35 URLs from the Wix pages sitemap, retaining their paths.
- 17 competition problem pages, the archive index, and historical results.
- All 17 results tables and both schedule tables.
- 176 unique PDFs, stored locally with their existing `/_files/ugd/` paths.
- 26 original image assets, including all three banner photos, sponsor logos, examples, campus photos, and branding. WebP derivatives are served to reduce transfer sizes; the logo uses a static frame.
- Registration, payment instructions, events, rules, resources, sponsors, contact, Discord, and archived TCS / puzzle hunt pages.
- Google Forms, Discord, sponsor, and other external destinations retained.

The complete page list is in `content/site.json`. `content/asset-manifest.json` maps source asset URLs to local paths. The old domain and Wix hosting are unchanged.

## Content requiring organizer review

These inconsistencies were present on the source site. Dates and competition rules were preserved rather than guessed.

| Location | Review needed |
| --- | --- |
| Homepage | Registration card still says CMM 2026 and opening in August. |
| Registration | Heading/date refer to January 30, 2027, but a later paragraph says CMM 2026. |
| Schedule and admissions events | Still describe January 23–24, 2026. A 2027 schedule was not available on the source. |
| Rules | Introduces a Guts Round but scoring still says 40% Team and 60% Individual. |
| Resources | Still references the CMM 2026 Power Round. |
| Payment | The Payment Form control did not supply a working link. A clearly labeled email link requests the payment URL from organizers. |
| Mailing list | The popup opens after Wix finishes loading and contains a Wix-hosted signup form. A replacement signup provider/URL is needed for independent hosting. The new site explicitly offers to email the organizers to request joining the list; it does not claim to subscribe users automatically. |

No registration or payment was submitted during verification. Existing mailing-list subscriber records are not publicly accessible and were not migrated. If those records live in Wix, export them from the Wix account separately.

## Presentation changes

The user selected a simpler responsive layout. This version replaces Wix positioning with semantic HTML, mobile navigation, readable tables, and local assets. Problem and solution links are organized by round. Check-payment labels are shown beside explicit payee, memo, return-address, and recipient labels. The empty Directions section now links to [Caltech's official visitor directions](https://www.caltech.edu/about/visit/directions).

Following the user's homepage screenshot, the homepage restores the full-width photo banner, centered white Sora title and bold introduction, and five photo links on a gold background. The links wrap into fewer columns on smaller screens. The original slideshow was subsequently inspected in a browser and all three photos restored: awards, audience, and chalkboard. Photos rotate every five seconds with a fade while the title and introduction stay fixed. At the user's request, the counter and playback controls were removed; rotation continues during mouse hover. Reduced-motion preferences disable automatic rotation and fading. Rotation pauses in hidden tabs and when the banner is offscreen. A static photo remains available without JavaScript. All images are local; the build adds the slideshow to the editable homepage fragment so it survives re-imports.

The shared header was subsequently matched to the user's original-header screenshot: dark red background, larger standalone gold CMM logo, white menu labels separated by thin vertical gold lines, and a pale gold band below. Desktop navigation is 18px; the compact menu uses 17px labels, with 16px dropdown links and at least 44px click targets. All dropdowns and keyboard open/close behavior were checked at 1852, 1440, 1181, 1180, 768, 390, and 320px. The full 35-page desktop/mobile browser checks passed.

The header was then shortened at the user's request: desktop red area reduced from 150px to 100px, gold band reduced to 16px, and logo width adjusted from 180px to 160px. Compact headers use an 80px minimum (72px on phones) with a 12px gold band. Menu text and click-target sizes remain the same. Header layout and all dropdowns passed checks at the seven widths above.

## Verification

- `npm run build`: successful static build.
- `npm run check`: all page headings, internal file references, and PDF signatures checked.
- `npm run test:browser`: all 35 pages checked at 1440px and 390px, including image decoding and navigation, without horizontal page overflow or JavaScript errors.
- `npm run test:slideshow`: full automatic rotation, continued rotation during hover, absence of controls, fixed heading position and layout checked at 1440, 390, and 320px; reduced-motion, JavaScript-disabled and failed-image fallbacks checked separately.
- Source-page links were compared with imported links; every destination was retained.
- Source tables were compared with imported tables; all 19 were retained.

### Final similarity review

- Compared all 35 source pages with the imported content: all 59 long paragraphs checked, all 19 tables' cell values, and 230 source link occurrences were retained.
- Verified 147 archive download links against their visually positioned Tests, Solutions, Qualifying Test, or Finals headings on the original 17 archive pages; no category mismatches were found.
- Downloaded all 176 PDFs from both the original host and GitHub Pages and compared SHA-256 hashes against the local originals. Every file matched byte for byte.
- Reviewed sponsor artwork and restored a dark red backdrop behind both white Citadel logos, matching the original's contrast without changing the artwork.
- Heading families, hierarchy, and dropdown sizing are documented in `TYPOGRAPHY-AUDIT.md`. The responsive layout, light color theme, and system body font remain intentional differences from Wix.
