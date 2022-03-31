import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';

const defaultProps = {
  id: 'testId',
  label: 'test label',
};

describe('<TextInput>', () => {
  it('renders correctly', () => {
    render(<TextInput {...defaultProps} />);
    expect(() => {
      screen.getByRole('textbox');
      screen.getByText('test label');
    }).not.toThrow();
    const elInput = screen.getByRole('textbox');
    expect(elInput.className).toBe('input ');
    expect(elInput.id).toBe('testId');
    const elLabel = screen.getByText<HTMLLabelElement>('test label');
    expect(elLabel.htmlFor).toBe('testId');
  });

  it('renders correctly errored state', () => {
    render(<TextInput {...defaultProps} errorMessage="oops" />);

    expect(() => {
      screen.getByRole('textbox');
      screen.getByText('test label');
      screen.getByText('oops');
    }).not.toThrow();

    const elInput = screen.getByRole('textbox');
    expect(elInput.className).toBe('input hasError');
    const elLabel = screen.getByText('oops');
    expect(elLabel.className).toBe('error');
  });

  it('should be able to type in input via click on label', () => {
    render(<TextInput {...defaultProps} />);
    const elInput = screen.getByRole<HTMLInputElement>('textbox');
    const elLabel = screen.getByText<HTMLLabelElement>('test label');
    fireEvent.click(elLabel);
    fireEvent.change(elInput, { target: { value: 'typing test' } });
    expect(elInput.value).toBe('typing test');
  });
});
