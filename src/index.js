import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import WebFont from 'webfontloader';
import App from './App';
import './base.css'; // eslint-disable-line import/no-unassigned-import

WebFont.load({
  google: {
    families: ['Press Start 2P'],
  },
});

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
