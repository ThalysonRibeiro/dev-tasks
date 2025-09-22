import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound component', () => {
  it('should render the 404 page with a link to the dashboard', () => {
    render(<NotFound />);

    // Check for the 404 heading
    expect(screen.getByRole('heading', { level: 1, name: /404/i })).toBeInTheDocument();

    // Check for the not found message
    expect(screen.getByText('Oops, a página que você está procurando não foi encontrada.')).toBeInTheDocument();

    // Check for the link to the dashboard
    const link = screen.getByRole('link', { name: /Voltar para o Início/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
