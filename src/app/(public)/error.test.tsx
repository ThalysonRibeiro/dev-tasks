import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorContent } from '../error';

describe('GlobalError component', () => {
  it('should render the error message and call reset on button click', () => {
    const mockError = new Error('Test error message');
    const mockReset = jest.fn();

    render(<ErrorContent error={mockError} reset={mockReset} />);

    // Check for titles and descriptions
    expect(screen.getByText('Oops, algo deu errado!')).toBeInTheDocument();
    expect(screen.getByText(/Lamentamos, mas parece que ocorreu um erro inesperado/)).toBeInTheDocument();

    // Check for error details
    expect(screen.getByText('Detalhes do erro:')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    // Check for the reset button
    const resetButton = screen.getByRole('button', { name: /Tente Novamente/i });
    expect(resetButton).toBeInTheDocument();

    // Simulate a click on the reset button
    fireEvent.click(resetButton);

    // Expect the reset function to have been called
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});