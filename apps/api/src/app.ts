import { Hono } from 'hono'
import { auth } from './auth'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello from API' }))
app.all('/api/auth', (c) => auth.handler(c.req.raw))
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

export { app }
