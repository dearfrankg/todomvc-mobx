import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

const ENTER_KEY = 13

@observer
export default class Entry extends Component {
  static propTypes = {
    handleSave: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <input
        type='text'
        ref='newField'
        className='new-todo'
        placeholder='What needs to be done?'
        onKeyDown={this.handleKeyDown}
        autoFocus={true}
      />
    )
  }

  handleKeyDown = (event) => {
    if (event.which === ENTER_KEY) {
      event.preventDefault()
      const node = ReactDOM.findDOMNode(this.refs.newField)
      this.props.handleSave(event.target.value.trim())
      node.value = ''
    }
  }
}
