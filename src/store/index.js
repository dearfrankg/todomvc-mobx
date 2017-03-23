import TodoStore from './todo'
import ViewStore from './view'

const todo = TodoStore.create()
const view = ViewStore.create()

const store = {
  todo,
  view
}

export default store
