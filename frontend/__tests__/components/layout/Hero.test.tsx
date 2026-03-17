import { render, screen } from '@testing-library/react';
import Hero from '@/components/layout/Hero';

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Hero Component', () => {
    it('renders the main heading', () => {
        render(<Hero />);
        expect(screen.getAllByText(/SRM University AP/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/SPORTS/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/COUNCIL/i)[0]).toBeInTheDocument();
    });
});
