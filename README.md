# Champion Southern Landscaping — website

A small three-page marketing site. Plain HTML, CSS and JavaScript — **no build step, no dependencies.**
Open `index.html` in a browser and it works.

```
index.html      Landing page — hero, work carousel, services, call-to-action
about.html      About us — company story + service areas + photo gallery
contact.html    Contact & booking form + phone/email/areas
css/style.css   All styling. Brand colours are the variables at the very top.
js/main.js      Mobile menu, carousel, form handling
images/         SVG placeholder graphics — replace with real photos
```

## Details already baked in

- **Name:** Champion Southern Landscaping
- **Phone:** (210) 772-9013
- **Areas served:** Rio Grande Valley · Greater San Antonio
- **Services** (grouped into 6 cards on the home page, full list in the contact form):
  residential & commercial maintenance, preventative maintenance, weed control, weed pulling,
  leaf & bed cleanup, trash pick-up & junk removal, pressure washing, tree trimming,
  plant installations, bed installation & design, mulch, sod installation, aeration, top dressing,
  hardscaping / zero-scaping, masonry, fire pits, concrete slabs, French drains, irrigation repair
- **About Us** copy is on `about.html` as supplied.

## Photos

Real project photos `ls1.jpeg` … `ls10.jpeg` are in `images/` and wired up:

- **Home carousel** — all 10 (`index.html`, the `.carousel__track` block)
- **About page** — `ls10` and `ls1` as the two large images, `ls7 / ls3 / ls6 / ls5` in the photo strip

To add or change carousel slides, copy a `.carousel__slide` block in `index.html`, point the
`src` at your file, and update the caption — the dots and "X of 10" labels are the only other
thing to bump. Compress new photos first (e.g. [squoosh.app](https://squoosh.app)); aim for
~1600px wide and under 300 KB.

Still on placeholders:

| File | Used on | Swap for | Good size |
|---|---|---|---|
| `hero.svg` | Home hero background | A wide, uncluttered property shot (white text sits on top) | ~1600×900 |
| `favicon.svg` | Browser tab icon | A logo mark, if you have one | square |

## Still to confirm / fill in

| What | Where | Note |
|---|---|---|
| **Hero image** | `images/hero.svg` | Still the placeholder illustration — a real photo here lifts the whole page. |
| **Social links / license #s** | footer in the three `.html` files | Add if you want them shown. |
| **Before/after photos** | — | See below — worth adding if you have matching "before" shots. |

Contact details baked in: phone **(210) 772-9013**, email **championsouthernlandscaping@gmail.com**
(used in `contact.html` and as the `MAILTO` fallback in `js/main.js`).

## Before / after

Not built yet. If you have "before" photos taken from roughly the same spot as any of the
finished shots, a before/after section is the single most persuasive thing a landscaper can
show. Two ways to do it — a simple side-by-side pair per project, or a draggable slider — say
the word and it can be added.

## The contact form

Out of the box the form **needs no backend**: on submit it validates the fields, then opens the
visitor's email app with everything pre-filled to the address in `js/main.js` (`MAILTO`). The visitor
just presses send.

### Nicer option — inbox delivery without the email app

Use a free form service so entries land in your inbox (or a spreadsheet) directly:

1. Sign up at **[formspree.io](https://formspree.io)** (free tier is fine) and create a form.
2. Copy your form endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `contact.html`, change `<form ... action="https://formspree.io/f/your-form-id">` to your endpoint.

`js/main.js` detects the real endpoint and submits in the background, showing a
"thanks, we'll be in touch" message without leaving the page. [Netlify Forms](https://docs.netlify.com/forms/setup/)
also works if you host on Netlify (add `netlify` to the `<form>` tag).

## Publishing it

Any static host works — drag the folder onto **[Netlify Drop](https://app.netlify.com/drop)**,
push to **GitHub Pages**, or upload via FTP to any web host. No server-side setup required.
