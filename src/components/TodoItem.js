import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

@observer
export default class TodoItem extends React.Component {
  static propTypes = {
    todo: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired
  }

  @observable editText = ''

  render() {
    const {todo, view} = this.props
    return (
      <li className={[
        todo.completed ? 'completed' : '',
        (todo === view.todoBeingEdited) ? 'editing' : ''
      ].join(' ')}>
        <div className='view'>
          <input
            type='checkbox'
            className='toggle'
            checked={todo.completed}
            onChange={todo.toggle}
          />
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.title}
          </label>
          <button className='destroy' onClick={todo.destroy} />
        </div>
        <input
          type='text'
          ref='editField'
          className='edit'
          value={this.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    )
  }

  handleDoubleClick = () => {
    const todo = this.props.todo
    this.props.view.todoBeingEdited = todo
    this.editText = todo.title
  }

  handleSubmit = (event) => {
    const { todo, view } = this.props
    const val = event.target.value.trim()
    if (val) {
      todo.setTitle(val)
    } else {
      todo.destroy()
    }
    view.todoBeingEdited = null
  }

  handleKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      this.editText = this.props.todo.title
      this.props.view.todoBeingEdited = null
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  handleChange = (event) => {
    this.editText = event.target.value
  }
}
