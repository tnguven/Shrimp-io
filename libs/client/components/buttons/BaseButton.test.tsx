import { render, screen } from '@testing-library/react';
import { BaseButton } from './BaseButton';

const defaultProps = {
  extendStyle: 'testStyle',
};

describe('<BaseButton>', () => {
  it('renders correctly', () => {
    render(<BaseButton {...defaultProps}>btn</BaseButton>);

    expect(() => {
      screen.getByRole('button');
    }).not.toThrow();

    const elBtn = screen.getByText('btn');
    expect(elBtn.className).toBe('button testStyle');
  });
});
