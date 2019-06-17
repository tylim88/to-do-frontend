import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider, toDoContainer } from './state'
import { HashRouter } from 'react-router-dom'

// hydrate store container with data from local storage
toDoContainer.initialize()

ReactDOM.render(
	// provider keep store container instances
	<Provider>
		<HashRouter>
			<App />
		</HashRouter>
	</Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// service worker must run over HTTPS
serviceWorker.register()
