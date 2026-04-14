import { parseHTML } from 'linkedom'

export default defineEventHandler(async (event) => {
  const param = getRouterParam(event, 'path') || ''
  const href = Array.isArray(param) ? param.join('/') : param
  if (!href) {
    throw createError({ statusCode: 400, message: 'Missing url parameter' })
  }

  const path = `/${href}`.replace(/\/{2,}/g, '/')
  let body: string
  try {
    body = await $fetch<string>(path, { responseType: 'text' })
  }
  catch (e: unknown) {
    const err = e as { statusCode?: number, status?: number }
    const status = err.statusCode ?? err.status ?? 502
    throw createError({
      statusCode: Number.isFinite(status) ? status : 502,
      message: 'Failed to fetch page HTML',
    })
  }
  interface ParsedHtml {
    document: {
      querySelectorAll: (
        sel: string,
      ) => ArrayLike<{ getAttribute: (name: string) => string | null }>
    }
  }
  const doc = (parseHTML(body) as unknown as ParsedHtml).document
  const images = Array.from(doc.querySelectorAll('main img'))
    .map(node => ({
      srcset: node.getAttribute('srcset') || node.getAttribute('srcSet'),
      sizes: node.getAttribute('sizes'),
      src: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
      loading: node.getAttribute('loading'),
    }))
    .filter(img => img.src)

  return { images }
})
