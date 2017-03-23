import {observable, computed, reaction} from 'mobx'
import TodoModel from './todoItem'
import * as Utils from '../utils/utils'
import  { SHOW_ACTIVE, SHOW_COMPLETED } from '../constants'
import ViewStore from './view'

export default class TodoStore {
  static instance = null
  static create = () => {
    if (!TodoStore.instance) {
      TodoStore.instance = new TodoStore()
    }
    return TodoStore.instance
  }

  @observable todos = []

  @computed get activeTodoCount() {
    return this.todos.reduce(
      (sum, todo) => sum + (todo.completed ? 0 : 1),
      0
    )
  }

  @computed get activeTodoWord() {
    return Utils.pluralize(this.activeTodoCount, 'item')
  }

  @computed get completedCount() {
    return this.todos.length - this.activeTodoCount
  }

  @computed get visibleTodos() {
    const view = ViewStore.create()
    const todos =  this.todos.filter(todo => {
      switch (view.todoFilter) {
        case SHOW_ACTIVE:
          return !todo.completed
        case SHOW_COMPLETED:
          return todo.completed
        default:
          return true
      }
    })
    return todos
  }

  subscribeServerToStore() {
    reaction(
      () => this.toJS(),
      todos => fetch('/api/todos', {
        method: 'post',
        body: JSON.stringify({ todos }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
    )
  }

  subscribeLocalstorageToStore() {
    reaction(
      () => this.toJS(),
      todos => localStorage.setItem('mobx-react-todomvc-todos', JSON.stringify({ todos }))
    )
  }

  addTodo = (title) => {
    this.todos.push(TodoModel.create(this, Utils.uuid(), title, false))
  }

  toggleAll = (checked) => {
    this.todos.forEach(
      todo => todo.completed = checked
    )
  }

  clearCompleted = () => {
    this.todos = this.todos.filter(
      todo => !todo.completed
    )
  }

  toJS() {
    return this.todos.map(todo => todo.toJS())
  }

  static fromJS(array) {
    const todoStore = TodoStore.create()
    todoStore.todos = array.map(item => TodoModel.fromJS(todoStore, item))
    return todoStore
  }
}
