import { app } from '../app'

export { app }

export async function request(path: string, options?: RequestInit) {
  return app.request(path, options)
}
