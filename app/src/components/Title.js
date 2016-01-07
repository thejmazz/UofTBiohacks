import React from 'react'
import PureComponent from 'react-pure-render/component'

export default class Button extends PureComponent {
  render() {
    const { title } = this.props

    return(<h1>{title}</h1>)
  }
}
