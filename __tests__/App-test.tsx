import React from 'react';

import { render, fireEvent, act } from '@testing-library/react-native';
import nock from 'nock';
import App from '../App';

jest.useFakeTimers();

global.fetch = require('node-fetch');

nock('https://api.github.com').get('/users/CarlosLevir').reply(200, {
  name: 'Carlos Levir',
});

describe('Render successfully', () => {
  it('renders App successfully', () => {
    const { toJSON } = render(<App />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders home components successfully', async () => {
    const { getByText } = render(<App />);

    await getByText('Você não está logado');
    await getByText('Entrar');
  });

  // it('changes text when login button is clicked', async () => {
  //   const { getByText } = render(<App />);

  //   const button = await getByText('Entrar');

  //   await getByText('Você não está logado');

  //   fireEvent.press(button);

  //   await getByText('Você está logado');
  // });

  it('call github when user clicks on login button', async () => {
    const { getByText } = render(<App />);

    const button = await getByText('Entrar');

    await act(() => fireEvent.press(button));

    jest.advanceTimersByTime(1000);

    await getByText('Carlos Levir');
  });
});
