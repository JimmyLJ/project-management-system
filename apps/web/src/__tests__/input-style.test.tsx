import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ForgotPasswordPage } from '../components/forgot-password-page'
import { LoginPage } from '../components/login-page'
import { RegisterPage } from '../components/register-page'

function expectInputContainerClasses(input: HTMLElement) {
  const container = input.parentElement
  expect(container).toBeTruthy()
  const className = container?.getAttribute('class') ?? ''
  expect(className).toContain('bg-[#f7f7f8]')
  expect(className).toContain('dark:bg-[#0f172a]')
}

describe('Auth input styles', () => {
  it('matches login inputs to registration style', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expectInputContainerClasses(screen.getByLabelText('邮箱地址'))
    expectInputContainerClasses(screen.getByLabelText('密码'))
  })

  it('matches registration inputs to reference style', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expectInputContainerClasses(screen.getByLabelText('姓名'))
    expectInputContainerClasses(screen.getByLabelText('邮箱'))
    expectInputContainerClasses(screen.getByLabelText('密码'))
  })

  it('matches forgot password input to reference style', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    )

    expectInputContainerClasses(screen.getByLabelText('邮箱地址'))
  })
})
