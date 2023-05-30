
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaphirPage from './SaphirPage';

describe('SaphirPage', () => {
  it('renders default text when no text prop is provided', () => {
    render(<SaphirPage />);
    const defaultTextElement = screen.getByText('Default Text');
    expect(defaultTextElement).toBeInTheDocument();
  });

  it('renders custom text when a text prop is provided', () => {
    const customText = 'Custom Text';
    render(<SaphirPage text={customText} />);
    const customTextElement = screen.getByText(customText);
    expect(customTextElement).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<SaphirPage onClick={handleClick} />);
    const componentElement = screen.getByText('Default Text');
    userEvent.click(componentElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

    