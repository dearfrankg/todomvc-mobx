import React from 'react'
import { observer } from "mobx-react"
import { Router } from 'director/build/director'
import DevTool from 'mobx-react-devtools'
import Header from './Header'
import Footer from './Footer'
import MainSection from './MainSection'

@observer
export default class App extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }

  render() {
    const {todo, view} = this.props.store
    return (
      <div>
        <DevTool />
        <Header addTodo={todo.addTodo} />
        <MainSection todo={todo} view={view} />
        <Footer todo={todo} view={view} />
      </div>
    )
  }

  componentDidMount() {
    var { view } = this.props.store
    const [ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ] = view.todoFilters
    var router = Router({
      '/': () => { view.todoFilter = SHOW_ALL },
      '/active': () => { view.todoFilter = SHOW_ACTIVE },
      '/completed': () => { view.todoFilter = SHOW_COMPLETED },
    }).init('/')
  }
}
