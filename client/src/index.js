import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: "dark",
  }
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ThemeProvider>,
  
  document.getElementById('root')
);


reportWebVitals();
