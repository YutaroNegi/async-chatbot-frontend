import { render, screen } from '@testing-library/react'
import Home from './Home'

test('renders welcome message', () => {
  render(<Home />)
  const heading = screen.getByText(/Home Page/i)
  expect(heading).toBeInTheDocument()
})
