import { render, screen } from '@testing-library/react';
import { ButtonWithSpinner } from './ButtonWithSpinner';

const defaultProps = {
  isLoading: false,
  onClick: jest.fn(),
};

describe('<ButtonWithSpinner>', () => {
  it('renders correctly', () => {
    render(<ButtonWithSpinner {...defaultProps}>btn</ButtonWithSpinner>);

    expect(() => {
      screen.getByText('btn');
    }).not.toThrow();

    const elBtn = screen.getByRole('button');
    expect(elBtn.className).toBe('button button');
  });

  it('renders spinner', () => {
    const { rerender } = render(
      <ButtonWithSpinner {...defaultProps} isLoading>
        btn
      </ButtonWithSpinner>
    );

    expect(() => {
      screen.getByRole('button');
      screen.getByRole('img');
    }).not.toThrow();

    const elSpinner = screen.getByAltText<HTMLImageElement>('Loading spinner');
    expect(elSpinner.className).toBe('spinner');
    expect(elSpinner.src).toContain('spinner.png');

    rerender(<ButtonWithSpinner {...defaultProps}>btn</ButtonWithSpinner>);
    expect(() => {
      screen.getByRole('img');
    }).toThrow();
  });
});
