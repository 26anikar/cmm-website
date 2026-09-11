# Migration record

Source: https://www.caltechmathmeet.org/

Imported: September 10, 2026. Destination: https://26anikar.github.io/cmm-website/

## Coverage

- All 35 URLs from the Wix pages sitemap, retaining their paths.
- 17 competition problem pages, the archive index, and historical results.
- All 17 results tables and both schedule tables.
- 176 unique PDFs, stored locally with their existing `/_files/ugd/` paths.
- 25 original image assets, including sponsor logos, examples, campus photos, and branding. WebP derivatives are served to reduce transfer sizes; the logo uses a static frame.
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

Following the user's homepage screenshot, the homepage now restores the full-width awards photo, centered white Sora title and bold introduction, and five photo links on a gold background. The links wrap into fewer columns on smaller screens. The photo is static; the original Wix slideshow is not reproduced. Existing navigation and interior-page layouts remain in place.

## Verification

- `npm run build`: successful static build.
- `npm run check`: all page headings, internal file references, and PDF signatures checked.
- `npm run test:browser`: all 35 pages checked at 1440px and 390px, including image decoding and navigation, without horizontal page overflow or JavaScript errors.
- Source-page links were compared with imported links; every destination was retained.
- Source tables were compared with imported tables; all 19 were retained.

### Final similarity review

- Compared all 35 source pages with the imported content: all 59 long paragraphs checked, all 19 tables' cell values, and 230 source link occurrences were retained.
- Verified 147 archive download links against their visually positioned Tests, Solutions, Qualifying Test, or Finals headings on the original 17 archive pages; no category mismatches were found.
- Downloaded all 176 PDFs from both the original host and GitHub Pages and compared SHA-256 hashes against the local originals. Every file matched byte for byte.
- Reviewed sponsor artwork and restored a dark red backdrop behind both white Citadel logos, matching the original's contrast without changing the artwork.
- Heading families, hierarchy, and dropdown sizing are documented in `TYPOGRAPHY-AUDIT.md`. The responsive layout, light color theme, and system body font remain intentional differences from Wix.
