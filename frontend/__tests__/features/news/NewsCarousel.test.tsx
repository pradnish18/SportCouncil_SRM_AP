import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsCarousel from '@/features/news/NewsCarousel';
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
});

// Mock SWR to provide test data
jest.mock('swr');

const mockNewsData = [
  { id: '1', headline: 'Test Headline 1', imageUrl: '/test1.jpg' },
  { id: '2', headline: 'Test Headline 2', imageUrl: '/test2.jpg' },
];

describe('NewsCarousel Component', () => {
    beforeEach(() => {
        (useSWR as jest.Mock).mockReturnValue({
            data: mockNewsData,
            error: null,
            isLoading: false
        });
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('renders the carousel with fetched data', () => {
        render(<NewsCarousel />);
        expect(screen.getByText('Latest News')).toBeInTheDocument();
        expect(screen.getByText('Test Headline 1')).toBeInTheDocument();
        
        // Ensure second headline is NOT yet visible (depends on transition, but in DOM it might be if not unmounted)
        // With Framer Motion AnimatePresence mode="wait", only one should be in the document
        expect(screen.queryByText('Test Headline 2')).not.toBeInTheDocument();
    });

    it('navigates to the next slide when next button is clicked', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        render(<NewsCarousel />);

        const nextButton = screen.getByLabelText('Next story');
        await act(async () => {
             await user.click(nextButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Headline 2')).toBeInTheDocument();
        });
    });

    it('auto-advances the slide after 6 seconds', async () => {
        render(<NewsCarousel />);
        
        expect(screen.getByText('Test Headline 1')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(6000);
        });

        // UI state updates inside useEffect
        await waitFor(() => {
            expect(screen.getByText('Test Headline 2')).toBeInTheDocument();
        });
    });
    
    it('uses fallback data if fetch fails or returns empty', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: new Error('Failed to fetch'),
            isLoading: false
        });

        render(<NewsCarousel />);
        expect(screen.getByText('SRM AP Clinches Victory in Inter-University Cricket Championship')).toBeInTheDocument();
    });
});
