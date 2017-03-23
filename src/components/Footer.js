import React from 'react'
import {observer} from 'mobx-react'

@observer
export default class Footer extends React.Component {
  static propTypes = {
    todo: React.PropTypes.object.isRequired,
    view: React.PropTypes.object.isRequired
  }

  render() {
    const { todo, view } = this.props
    if (todo.todos.length === 0) {
      return null
    }

    return (
      <footer className='footer' data-spec='footer'>
        <span className='todo-count'>
          <strong>{todo.activeTodoCount || 'No'}</strong> {todo.activeTodoWord} left
        </span>

        <ul className='filters'>
          {view.todoFilters.map(this.renderFilterLink)}
        </ul>

        { !!todo.completedCount &&
          <button
            className='clear-completed'
            onClick={todo.clearCompleted}>
            Clear completed
          </button>
        }
      </footer>
    )
  }

  renderFilterLink = (filter, index) => {
    const { todoFilter } = this.props.view
    const url = ['', 'active', 'completed'][index]
    const caption = ['All', 'Active', 'Completed'][index]
    return (
      <li key={index}>
        <a href={'#/' + url}
          className={filter ===  todoFilter ? 'selected' : ''}>
          {caption}
        </a>
        {' '}
      </li>
    )
  }
}
