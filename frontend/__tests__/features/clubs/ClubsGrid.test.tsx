import { render, screen } from '@testing-library/react';
import ClubsGrid from '@/features/clubs/ClubsGrid';
import useSWR from 'swr';

// Mock simple matchMedia and IntersectionObserver
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

  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
});

// Mock SWR to provide test data
jest.mock('swr');

// Mock next/image to prevent warnings
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} priority={undefined} fill={undefined} />
    },
}));

describe('ClubsGrid Component', () => {
    beforeEach(() => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [],
            error: null,
            isLoading: false
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the clubs grid with fallback data', () => {
        // useSWR returns empty, should render fallback
        render(<ClubsGrid />);
        
        expect(screen.getByText('Cricket')).toBeInTheDocument();
        expect(screen.getByText('Badminton')).toBeInTheDocument();
        expect(screen.getByText('Football')).toBeInTheDocument();
        expect(screen.getByText('Expansion Hub')).toBeInTheDocument();
    });

    it('renders the clubs grid with fetched data', () => {
        const mockDynamicData = [
            { id: "mock-1", name: "MockClub", bgImageUrl: "mock.jpg", description: "A mock club" }
        ];

        (useSWR as jest.Mock).mockReturnValue({
            data: mockDynamicData,
            error: null,
            isLoading: false
        });

        render(<ClubsGrid />);
        
        expect(screen.getByText('MockClub')).toBeInTheDocument();
    });
});
