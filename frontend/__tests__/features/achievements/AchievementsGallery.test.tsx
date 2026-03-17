import { render, screen, fireEvent } from '@testing-library/react';
import AchievementsGallery from '@/features/achievements/AchievementsGallery';
import useSWR from 'swr';

// Mock matchMedia and IntersectionObserver
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

jest.mock('swr');

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} priority={undefined} fill={undefined} />
    },
}));

describe('AchievementsGallery Component', () => {
    beforeEach(() => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [], // Empty data to trigger static data
            error: null,
            isLoading: false
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders all sections when no filters are applied', () => {
        render(<AchievementsGallery />);
        
        expect(screen.getByText('Trophy Cabinet')).toBeInTheDocument();
        expect(screen.getByText('Accolades')).toBeInTheDocument();
        expect(screen.getByText('Athlete Records')).toBeInTheDocument();
        
        // Check some specific items
        expect(screen.getByText('South Zone Cricket Gold')).toBeInTheDocument();
        expect(screen.getByText('Sarah Khan — Highest Run Scorer')).toBeInTheDocument();
    });

    it('filters achievements by category correctly', () => {
        render(<AchievementsGallery />);
        
        const trophyFilterBtn = screen.getByRole('button', { name: /🏆 TROPHY/i });
        fireEvent.click(trophyFilterBtn);

        // Only trophies should be visible
        expect(screen.getByText('Trophy Cabinet')).toBeInTheDocument();
        expect(screen.queryByText('Accolades')).not.toBeInTheDocument();
        expect(screen.queryByText('Athlete Records')).not.toBeInTheDocument();
        
        expect(screen.getByText('South Zone Cricket Gold')).toBeInTheDocument();
        expect(screen.queryByText('Sarah Khan — Highest Run Scorer')).not.toBeInTheDocument(); // Accolade
    });
    
    it('shows empty state when filters match nothing', () => {
        render(<AchievementsGallery />);
        
        // Select an impossible combination using the select elements
        const selects = screen.getAllByRole('combobox');
        const sportSelect = selects[0];
        
        // Change sport to Athletics
        fireEvent.change(sportSelect, { target: { value: 'Athletics' } });
        
        // Athletics static data only has an RECORD.
        // Change category button to TROPHY
        const trophyFilterBtn = screen.getByRole('button', { name: /🏆 TROPHY/i });
        fireEvent.click(trophyFilterBtn);
        
        // Should show empty state
        expect(screen.getByText('No Records Found')).toBeInTheDocument();
    });
});
