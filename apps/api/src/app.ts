import { Hono } from 'hono'
import { auth } from './auth'
import { workspacesRouter } from './routes/workspaces'
import { projectsRouter } from './routes/projects'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello from API' }))
app.all('/api/auth', (c) => auth.handler(c.req.raw))
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))
app.route('/api/workspaces', workspacesRouter)
app.route('/api/projects', projectsRouter)

export { app }
