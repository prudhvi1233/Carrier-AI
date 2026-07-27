import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TopNavbar from './components/TopNavbar';
import { test, expect } from 'vitest';

test('renders TopNavbar branding', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <TopNavbar />
      </AuthProvider>
    </BrowserRouter>
  );
  const brandElement = screen.getByText(/CareerAI/i);
  expect(brandElement).toBeInTheDocument();
});
