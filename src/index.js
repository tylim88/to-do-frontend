import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'unstated'
import { toDoContainer, userContainer } from './state'
import { HashRouter } from 'react-router-dom'

// hydrate store container with data from local storage
toDoContainer.initialize()

ReactDOM.render(
    // provider keep store container instances
    <Provider inject={[toDoContainer, userContainer]}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
