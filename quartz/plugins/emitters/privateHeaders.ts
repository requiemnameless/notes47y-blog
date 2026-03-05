import { FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"

export const PrivateHeaders: QuartzEmitterPlugin = () => ({
  name: "PrivateHeaders",
  async *emit({ argv }) {
    // robots.txt: block all crawlers
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "robots" as FullSlug,
      ext: ".txt",
      content: `User-agent: *\nDisallow: /\n`,
    })

    // Cloudflare Pages _headers: prevent CDN caching of content
    yield write({
      ctx: { argv } as BuildCtx,
      slug: "_headers" as FullSlug,
      ext: "",
      content: `/*\n  Cache-Control: no-store, no-cache, must-revalidate, private\n  X-Robots-Tag: noindex, nofollow\n`,
    })
  },
  async *partialEmit() {},
})
