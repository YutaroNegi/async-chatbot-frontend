import { render, screen } from '@testing-library/react'
import Login from './Login'

test('renders welcome message', () => {
  render(<Login />)
  const heading = screen.getByText(/Login Page/i)
  expect(heading).toBeInTheDocument()
})
