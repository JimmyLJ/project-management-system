import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '../components/dashboard-page'

function mockOrganizationsFetch() {
  const mock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ organizations: [] }),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SettingsDialog', () => {
  it('opens and closes via close button', async () => {
    const fetchMock = mockOrganizationsFetch()
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    fireEvent.click(screen.getByTestId('nav-settings'))
    expect(await screen.findByTestId('settings-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('settings-close'))
    await waitFor(() => {
      expect(screen.queryByTestId('settings-dialog')).not.toBeInTheDocument()
    })
  })

  it('closes with Escape key', async () => {
    const fetchMock = mockOrganizationsFetch()
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    fireEvent.click(screen.getByTestId('nav-settings'))
    expect(await screen.findByTestId('settings-dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByTestId('settings-dialog')).not.toBeInTheDocument()
    })
  })

  it('allows clicking sidebar navigation without crashing', async () => {
    const fetchMock = mockOrganizationsFetch()
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    fireEvent.click(screen.getByTestId('nav-dashboard'))
    fireEvent.click(screen.getByTestId('nav-projects'))
    fireEvent.click(screen.getByTestId('nav-team'))
  })

  it('logs out and navigates to login', async () => {
    const fetchMock = mockOrganizationsFetch()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<div>登录页</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    fireEvent.click(screen.getByText('Ji'))
    fireEvent.click(screen.getByText('退出登录'))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST', credentials: 'include' }),
      )
      expect(screen.getByText('登录页')).toBeInTheDocument()
    })
  })
})
