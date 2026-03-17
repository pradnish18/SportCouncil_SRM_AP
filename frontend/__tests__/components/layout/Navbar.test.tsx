import { render, screen } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

// Fix Next/Link matching in tests
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  );
});

jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}));


describe('Navbar Component', () => {
    it('renders the logo', () => {
        render(<Navbar />);
        expect(screen.getAllByText(/SRM/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Sports/i)[0]).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Navbar />);
        // Navbar has desktop and mobile links
        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        
        const eventsLinks = screen.getAllByText('Events');
        expect(eventsLinks.length).toBeGreaterThan(0);
    });
});
