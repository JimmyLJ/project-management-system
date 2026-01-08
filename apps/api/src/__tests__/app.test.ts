import { describe, it, expect } from 'vitest'
import { app } from './test-utils'

describe('API', () => {
  describe('GET /', () => {
    it('返回欢迎消息', async () => {
      const res = await app.request('/')

      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json).toEqual({ message: 'Hello from API' })
    })
  })

  describe('404 处理', () => {
    it('访问不存在的路由返回 404', async () => {
      const res = await app.request('/not-found')

      expect(res.status).toBe(404)
    })
  })
})
