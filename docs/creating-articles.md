# Creating an article

Ravinto articles use the shared `_layouts/article.html` layout, which extends Minima's `default` layout. Keep the article body in Markdown and use `layout: article`; the layout supplies the page heading, language links, metadata, table of contents, optional audio, key sources and index links.

## Required front matter

```yaml
---
layout: article
title: Example plant – nutrition and growing guide
description: A concise, accurate summary for search results.
lang: en
permalink: /en/plants/example-plant/
toc_title: On this page
toc_levels: "2,3"
index_url: /en/
article_labels:
  published: Published
  updated: Updated
  author: Author
  languages: Read this article in another language
  table: Data table
  sources: Key sources
  related: Related articles
  index: Plant index
translations:
  - { lang: fi, hreflang: fi-FI, label: Suomi, url: /kasvit/esimerkkikasvi/ }
  - { lang: en, hreflang: en, label: English, url: /en/plants/example-plant/ }
  - { lang: th, hreflang: th, label: ภาษาไทย, url: /th/plants/example-plant/ }
---
```

The `title`, `description`, `lang`, `permalink`, `toc_title`, localized `article_labels`, and `translations` are needed for the full article experience. The layout emits one H1 from `title`. Start the article body at H2 and use H3 for subsections. Kramdown generates heading IDs; add explicit IDs such as `{#nutrition}` when you need stable cross-language anchors.

Use the same translation list on every language version, changing only the current page's `lang`, title, description, permalink and localized labels. Keep each translation URL aligned with that page's permalink. The head include derives `hreflang` and `x-default` from this list; canonical URLs continue to come from `jekyll-seo-tag`.

## Optional fields

```yaml
intro: A short introduction shown beneath the title.
date: 2026-10-20
updated: 2026-10-20
author:
  name: Example Author
  type: Person
image: /assets/images/example-plant.webp
image_alt: Example plant with distinctive flower heads
related:
  - { title: Another article, url: /en/plants/another-plant/ }
sources:
  - { title: Research paper, url: https://example.org/research-paper }
  - { title: Source without a public URL }
```

Only set dates and authors when verified. Dates use `YYYY-MM-DD`. An author needs a `name` and a Schema.org `type` of `Person` or `Organization` for the JSON-LD author field. `image` is the share/Article-schema image; `image_alt` supplies its schema caption. Place article images in the Markdown body with descriptive alt text, dimensions, and lazy loading. Related links, sources, intro, dates, author, and image are omitted when absent. Local `url` values must include the page path but not the `/Ravinto` base path.

The layout adds an Article JSON-LD object using known page data. `jekyll-seo-tag` continues to emit the page's WebPage metadata, title, description, and canonical URL. Do not manually add duplicate SEO or JSON-LD blocks.

## Table of contents and tables

The deferred `assets/js/article-toc.js` reads H2/H3 headings from the rendered article and builds the localized table of contents. Set `toc_title` and `toc_levels` to control its label and heading levels. The same small script makes tables keyboard-focusable and gives them localized accessible names. No heading list is duplicated in front matter.

## Images and research sources

Store optimized images in `assets/images/`. Use WebP where practical, provide accurate alt text, and include intrinsic `width` and `height` on every `<img>` to avoid layout shifts. Use `<figure>` and `<figcaption>` when an image needs a caption.

Link each research claim close to the relevant text, using a direct link to the identifiable paper or authoritative source rather than a general organization homepage. Make clear whether evidence comes from human, animal, or laboratory research, and do not present evidence from one type as proof of an effect in another. The optional `sources` list adds a localized key-sources section at the end of the article; list only sources that are individually identifiable and support claims made in the article.

The repository checks article front matter, language-page permalinks, and referenced local media during `npm test`. Run a production Jekyll build before the sitemap check; the check verifies that every sitemap URL uses the configured `/Ravinto/` base path and that `robots.txt` points to the generated sitemap.

## Audio

Omit `audio` when an article has no narration. When audio exists, add:

```yaml
audio:
  src: /assets/audio/example-en.mp3
  play: Listen
  pause: Pause
  loading: Loading audio…
  error: Could not play the audio. Check your connection and try again.
  note: AI-generated audio.
  aria_label: Listen to the article
```

The layout includes `_includes/audio-player.html` only when `audio.src` is present, so `assets/js/audio-player.js` is not loaded for articles without audio. Use localized audio labels and ensure the narration matches the final text.

## New plant and language pages

For a new language, create a Markdown page with a unique localized URL, correct `lang`, localized labels and title/description, then add that URL and its `hreflang` entry to the `translations` list on every counterpart. Add the page to the relevant localized plant index. Keep the same heading IDs across translations where possible so section links remain predictable.
