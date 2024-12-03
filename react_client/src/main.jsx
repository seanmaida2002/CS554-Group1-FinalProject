import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import fbconfig from './firebase/FirebaseConfig.js';
import {initializeApp} from 'firebase/app';

const app = initializeApp(fbconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)