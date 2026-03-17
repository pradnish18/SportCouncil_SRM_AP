import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventsList from '@/features/events/EventsList';
import useSWR from 'swr';

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

jest.mock('swr');

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} priority={undefined} fill={undefined} />
    },
}));

describe('EventsList Component', () => {
    beforeEach(() => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [], // Empty data to use static fallback
            error: null,
            isLoading: false
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders UPCOMING events by default', () => {
        render(<EventsList />);
        
        // From static events, Badminton & Athletics & Football are UPCOMING
        expect(screen.getByText('University Open Badminton')).toBeInTheDocument();
        expect(screen.getByText('Annual Athletic Meet')).toBeInTheDocument();
        expect(screen.getByText('South Zone Football Cup')).toBeInTheDocument();
        
        // PAST shouldn't be rendered initially
        expect(screen.queryByText('T20 Championship Finals')).not.toBeInTheDocument(); // PAST
    });

    it('switches to LIVE events when LIVE filter is clicked', async () => {
        render(<EventsList />);
        
        const pastTab = screen.getByRole('button', { name: /PAST/i });
        fireEvent.click(pastTab);

        await waitFor(() => {
            expect(screen.getByText('T20 Championship Finals')).toBeInTheDocument();
        });
    });

    it('filters events by search query', () => {
        render(<EventsList />);
        
        const searchInput = screen.getByPlaceholderText('Search events...');
        fireEvent.change(searchInput, { target: { value: 'Badminton' } });

        expect(screen.getByText('University Open Badminton')).toBeInTheDocument();
        expect(screen.queryByText('Annual Athletic Meet')).not.toBeInTheDocument();
    });
    
    it('filters events by sport', () => {
        render(<EventsList />);
        
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Athletics' } });

        expect(screen.getByText('Annual Athletic Meet')).toBeInTheDocument();
        expect(screen.queryByText('University Open Badminton')).not.toBeInTheDocument();
    });
});
