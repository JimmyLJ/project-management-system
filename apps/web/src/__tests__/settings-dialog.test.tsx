import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    render(<DashboardPage />)
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
    render(<DashboardPage />)
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
    render(<DashboardPage />)
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    fireEvent.click(screen.getByTestId('nav-dashboard'))
    fireEvent.click(screen.getByTestId('nav-projects'))
    fireEvent.click(screen.getByTestId('nav-team'))
  })
})
