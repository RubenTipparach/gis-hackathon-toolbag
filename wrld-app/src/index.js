import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WrldApp from './wrld-app';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WrldApp />, document.getElementById('root'));
registerServiceWorker();
