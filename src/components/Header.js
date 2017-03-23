import React from 'react'
import { observer } from "mobx-react"
import Entry from './Entry'


class Header extends React.Component {
  static propTypes = {
    addTodo: React.PropTypes.func.isRequired
  }

  handleSave = (text) => {
    if (text) {
      this.props.addTodo(text)
    }
  }

  render () {
    return (
      <header className="header">
        <h1>todos</h1>
        <Entry handleSave={this.handleSave} />
      </header>
    )
  }
}

export default observer(Header)
