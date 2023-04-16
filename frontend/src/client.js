// sanity 客户端（固定语法，见 sanity 文档）

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-04-13',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN
})

// 图片相关的处理
const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)