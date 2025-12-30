import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from '../components/register-page'

function mockFetch(ok: boolean, message?: string | null) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(message === undefined ? { message: 'error' } : message),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('RegisterPage', () => {
  it('submits registration payload', async () => {
    const fetchMock = mockFetch(true)
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('姓名'), {
      target: { value: '测试用户' },
    })
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '注册' }))

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
        <RegisterPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('姓名'), {
      target: { value: '测试用户' },
    })
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '注册' }))

    expect(
      await screen.findByText('注册失败，请稍后再试。'),
    ).toBeInTheDocument()
  })
})
