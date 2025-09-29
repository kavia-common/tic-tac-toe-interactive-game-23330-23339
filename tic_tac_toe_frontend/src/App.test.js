import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and controls', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Player vs Player/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Player vs Computer/i })).toBeInTheDocument();
});
