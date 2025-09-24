import { render, screen } from '@testing-library/react';
import { EmptyGoal } from '../empyt-goal';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock UI components
jest.mock('@/components/ui/dialog', () => ({
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-trigger">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

describe('EmptyGoal Component', () => {
  it('should render the component with image, text, and button', () => {
    render(<EmptyGoal />);

    // Check for the image
    const image = screen.getByAltText('imagem de fundo dashboard');
    expect(image).toBeInTheDocument();

    // Check for the text
    expect(screen.getByText('Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?')).toBeInTheDocument();

    // Check for the DialogTrigger and the Button inside it
    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar meta/i })).toBeInTheDocument();
  });
});
