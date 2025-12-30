import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../components/login-page'

function mockFetch(ok: boolean, message?: string | null) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(message === undefined ? { message: 'error' } : message),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('LoginPage', () => {
  it('submits login payload', async () => {
    const fetchMock = mockFetch(true)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('邮箱地址'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [, requestInit] = fetchMock.mock.calls[0]
    expect(requestInit?.method).toBe('POST')
    expect(requestInit?.credentials).toBe('include')
    expect(requestInit?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(requestInit?.body).toContain('test@example.com')
  })

  it('shows error message when API fails', async () => {
    mockFetch(false, null)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('邮箱地址'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(
      await screen.findByText('登录失败，请重试。'),
    ).toBeInTheDocument()
  })
})
