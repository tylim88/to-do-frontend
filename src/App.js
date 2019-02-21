import React, { Component } from 'react'
import ButtonsFilter from './component/ButtonsFilter'
import Input from './component/Input'
import List from './component/List'
import SignUp from './component/SignUp'
import Login from './component/Login'
import NavBar from './component/NavBar'
import { Route } from 'react-router-dom'
import { toDoContainer } from './state'
import './style/App.css'

class App extends Component {
    render() {
        return (
            <div className="app">
                <NavBar />
                <h1 className="title">To Do List</h1>
                <Login />
                <SignUp />
                <Route
                    // the button will be rendered with different props depend on what route
                    exact
                    path="/"
                    render={() => {
                        //update the filter based on the route
                        toDoContainer.updateFilter('All')

                        return <ButtonsFilter />
                    }}
                />
                <Route
                    path="/Active"
                    render={() => {
                        toDoContainer.updateFilter('Active')
                        return <ButtonsFilter />
                    }}
                />
                <Route
                    path="/Done"
                    render={() => {
                        toDoContainer.updateFilter('Done')
                        return <ButtonsFilter />
                    }}
                />
                <Input />
                <List />
            </div>
        )
    }
}

export default App
