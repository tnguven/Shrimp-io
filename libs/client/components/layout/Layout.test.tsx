import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

const defaultProps = {
  title: 'page title',
};

describe('<Layout>', () => {
  it('renders correctly', () => {
    render(
      <Layout {...defaultProps}>
        <span>test</span>
      </Layout>
    );

    expect(() => {
      screen.getByText('test');
    }).not.toThrow();
  });
});
