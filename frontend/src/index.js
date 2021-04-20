import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';

window.addEventListener('load',function() {
  let mapsScript = document.createElement('script');
  mapsScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_KEY}`);
  mapsScript.defer = true;
  mapsScript.setAttribute('async', '');
  document.body.appendChild(mapsScript);
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
