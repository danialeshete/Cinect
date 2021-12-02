import { render, screen } from '@testing-library/react';
import App from './App';

// @ts-ignore
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // @ts-ignore
  expect(linkElement).toBeInTheDocument();
});
