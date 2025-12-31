import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('Theme toggle', () => {
  it('toggles dark mode and persists preference', async () => {
    const fetchMock = mockOrganizationsFetch()
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    const toggle = screen.getByLabelText('切换到深色模式')
    fireEvent.click(toggle)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(screen.getByLabelText('切换到浅色模式')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('切换到浅色模式'))
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
