import React from 'react'
import {observer} from 'mobx-react'
import TodoItem from './TodoItem'

@observer
export default class MainSection extends React.Component {
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
      <section className="main">
        <input
          type="checkbox"
          className="toggle-all"
          checked={todo.activeTodoCount === 0}
          onChange={(e) => todo.toggleAll(e.target.checked)}
        />
        <ul className="todo-list">
          {todo.visibleTodos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
              view={view}
            />
          )}
        </ul>
      </section>
    )
  }
}
