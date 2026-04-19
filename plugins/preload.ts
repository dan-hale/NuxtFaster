import type { HeadTag } from 'unhead/types'

export default defineNuxtPlugin({
  name: 'preload',
  hooks: {
    'app:rendered': async ({ ssrContext }) => {
      if (!ssrContext)
        return
      const tags = await ssrContext.head.resolveTags()
      if (!ssrContext.payload.data)
        throw new Error('Payload data is not available')
      ssrContext.payload.data.preload = tags.filter(d => d.tag === 'link' && d.props?.rel === 'preload').map(d => d.props)
    },
    'link:prefetch': async (url) => {
      const payload = await loadPayload(url)
      if (!payload)
        return
      injectHead().push({
        link: payload.data.preload as HeadTag['props'][],
      })
    },
  },
  dependsOn: ['nuxt:head'],
})
