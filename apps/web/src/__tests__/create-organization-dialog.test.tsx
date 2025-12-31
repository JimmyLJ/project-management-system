import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CreateOrganizationDialog } from '../components/create-organization-dialog'

function mockFetch(ok: boolean) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve({ message: 'error' }),
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

class FileReaderMock {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null
  result: string | ArrayBuffer | null = null
  readAsDataURL() {
    this.result = 'data:image/png;base64,AA=='
    if (this.onload) {
      this.onload.call(this, {} as ProgressEvent<FileReader>)
    }
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CreateOrganizationDialog', () => {
  it('submits form data', async () => {
    const fetchMock = mockFetch(true)
    vi.stubGlobal('FileReader', FileReaderMock)
    render(
      <CreateOrganizationDialog open onCreated={() => {}} onClose={() => {}} />,
    )

    fireEvent.change(screen.getByLabelText('组织名称'), {
      target: { value: '测试组织' },
    })
    fireEvent.change(screen.getByLabelText('唯一标识'), {
      target: { value: 'test-org' },
    })

    fireEvent.click(screen.getByRole('button', { name: '创建组织' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [, requestInit] = fetchMock.mock.calls[0]
    expect(requestInit?.method).toBe('POST')
    expect(requestInit?.credentials).toBe('include')
    expect(requestInit?.body).toBeInstanceOf(FormData)
    const body = requestInit?.body as FormData
    expect(body.get('name')).toBe('测试组织')
    expect(body.get('slug')).toBe('test-org')
  })

  it('shows error for invalid logo type', async () => {
    vi.stubGlobal('FileReader', FileReaderMock)
    render(
      <CreateOrganizationDialog open onCreated={() => {}} onClose={() => {}} />,
    )

    const file = new File([new Uint8Array([1])], 'logo.gif', {
      type: 'image/gif',
    })
    fireEvent.change(screen.getByLabelText('组织 Logo'), {
      target: { files: [file] },
    })

    expect(await screen.findByText('仅支持 PNG 或 JPG 图片。')).toBeInTheDocument()
  })

  it('shows error for oversized logo', async () => {
    vi.stubGlobal('FileReader', FileReaderMock)
    render(
      <CreateOrganizationDialog open onCreated={() => {}} onClose={() => {}} />,
    )

    const file = new File(
      [new Uint8Array(10 * 1024 * 1024 + 1)],
      'logo.png',
      {
        type: 'image/png',
      },
    )
    fireEvent.change(screen.getByLabelText('组织 Logo'), {
      target: { files: [file] },
    })

    expect(await screen.findByText('图片大小不能超过 10MB。')).toBeInTheDocument()
  })
})
