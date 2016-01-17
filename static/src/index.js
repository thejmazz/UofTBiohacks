import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'

import mount from './mount.js'
import counter from './reducers/counter.js'

class Index extends Component {
  tick = () => {
    const { dispatch } = this.props
    dispatch({type: 'INCREMENT'})
  };

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { count } = this.props

    return(
      <h1>Hello World, {count}</h1>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    count: state
  }
}

export default mount(connect(mapStateToProps)(Index), counter)
