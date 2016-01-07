// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

// Components
import Title from './components/Title'

// App container setup
let appContainer = document.createElement('div')
appContainer.id = 'appContainer'
document.body.appendChild(appContainer)


class Home extends React.Component {
  render() {
    return (
      <div>
        <Title title="UofT BioHacks" />
        <Link to="/register">Register</Link>
        {this.props.children}
      </div>
    )
  }
}

class Register extends React.Component {
  render() {
    return (
      <Title title="Register" />
    )
  }
}

// Main render
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="/register" component={Register} />
  </Router>,
  appContainer
)