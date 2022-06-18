import { render, screen } from '@testing-library/react'
import { Todo } from './todo'

test('Renders the app logo', () => {
    render(<Todo />)
    const linkElement = screen.getByText(/Todoify/i)
    expect(linkElement).toBeInTheDocument()
})
