import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock Next.js features that might break in raw JSDOM
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} />;
    },
}));

describe('Home Page Sanity Check', () => {
    it('renders without crashing', () => {
        render(<Home />);
    });
});
