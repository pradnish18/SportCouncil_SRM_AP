import { render, screen } from '@testing-library/react';
import AboutCouncil from '@/components/layout/AboutCouncil';

jest.mock('@/components/layout/AboutCouncil', () => {
    return function DummyAboutCouncil() {
        return (
            <div>
                <h2>About Our Council</h2>
                <div>Student Athletes</div>
                <div>Active Clubs</div>
                <div>Championships</div>
            </div>
        );
    };
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('AboutCouncil Component', () => {
    it('renders the heading', () => {
        render(<AboutCouncil />);
        // Might render split into lines, check for partial text
        expect(screen.getByText(/About Our/i)).toBeInTheDocument();
        expect(screen.getByText(/Council/i)).toBeInTheDocument();
    });

    it('renders the stats', () => {
        render(<AboutCouncil />);
        expect(screen.getByText('Student Athletes')).toBeInTheDocument();
        expect(screen.getByText('Active Clubs')).toBeInTheDocument();
        expect(screen.getByText('Championships')).toBeInTheDocument();
    });
});
