import { render, screen } from '@testing-library/react';
import { EmptyField, EmptyUrlList } from './EmptyField';

describe('<EmptyField>', () => {
  it('renders correctly', () => {
    render(
      <EmptyField>
        <span>test</span>
      </EmptyField>
    );

    expect(() => {
      screen.getByText('test');
    }).not.toThrow();
  });
});

const defaultProps = {
  text: 'props text',
};

describe('<EmptyUrlList>', () => {
  it('renders correctly', () => {
    render(<EmptyUrlList {...defaultProps} />);

    expect(() => {
      screen.getByText('props text');
      screen.getByAltText('empty folder icon');
    }).not.toThrow();

    const elImg = screen.getByAltText<HTMLImageElement>('empty folder icon');
    expect(elImg.src).toContain('empty-button.png');
  });
});
