import React from 'react'
import { mount } from 'enzyme'
import MainSection from '../MainSection'
import TodoItem from '../TodoItem'
import Footer from '../Footer'
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from '../../constants'
import { Assert } from '../../utils/unit'

describe('MainSection Component', (Component = MainSection) => {
  let props
  let mountedComponent
  const getComponent = () => {
    if (!mountedComponent) {
      mountedComponent = mount( <Component {...props} /> )
    }
    return mountedComponent
  }

  const assert = Assert.create(getComponent)

  beforeEach(() => {
    props = {
      todo: {
        todos: [
          { text: 'Use Redux', completed: false, id: 0 }, 
          { text: 'Run the tests', completed: true, id: 1 }
        ],
        visibleTodos: [
            { text: 'Use Redux', completed: false, id: 0 }, 
            { text: 'Run the tests', completed: true, id: 1 }
        ],
        addTodo: jest.fn(),
        toggleAll: jest.fn(),
        clearCompleted: jest.fn(),
      },
      view: {
        todoBeingEdited: ''
      },
      actions: {
        editTodo: jest.fn(),
        deleteTodo: jest.fn(),
        completeTodo: jest.fn(),
        completeAll: jest.fn(),
        clearCompleted: jest.fn()
      }
    }
    mountedComponent = undefined
  })


  describe('rendering', () => {
    it('should render correctly', () => {
      assert.hasChildOfType({selector: '.main', type: 'section'})
      assert.hasChildOfType({selector: '.toggle-all', type: 'input'})
      assert.hasChildOfType({selector: '.todo-list', type: 'ul'})

      const todoItemsType = getComponent().find('.todo-list').children().at(0).type()
      expect(todoItemsType).toBe(TodoItem)

      const todoList = getComponent().find('.todo-list')
      expect(todoList.children().length).toBe(2)
    })


    describe('when we have todos', () => {
      beforeEach(() => {
        props.todo.todos = [{}, {}]
      })
      it('should render toggle-all checkbox', () => {
        assert.isPresent({selector: '.toggle-all'})
      })
    })

    describe('when we have no todos', () => {
      beforeEach(() => {
        props.todo.todos = []
      })

      it('should not render toggle-all checkbox', () => {
        assert.isNotPresent({selector: '.toggle-all'})
      })
    })

    describe('when all todos are completed', () => {
      beforeEach(() => {
        props.todo.activeTodoCount = 0
      })

      it('should render toggle-all checkbox checked', () => {
        assert.hasChildWithProp({
          selector: '.toggle-all',
          prop: 'checked',
          propValue: true
        })
      })
    })

    describe('when all todos are not completed', () => {
      beforeEach(() => {
        props.todo.activeTodoCount = 3
      })

      it('should render toggle-all checkbox not checked', () => {
        assert.hasChildWithProp({
          selector: '.toggle-all',
          prop: 'checked',
          propValue: false
        })
      })
    })
  })

  describe('callbacks', () => {
    describe('when clicking toggle-all', () => {
      it('should call toggleAll', () => {
        assert.simulateEvent({selector: '.toggle-all', simulateArgs: ['change']})
        expect(props.todo.toggleAll).toHaveBeenCalled()
      })
    })
  })


  describe('props passed to components', () => {
    describe('toggle-all', () => {
      it('should pass `toggleAll` to onChange prop', () => {
        assert.hasChildWithPropAsAnonymousFn({
          selector: '.toggle-all',
          prop: 'onChange'
        })
      })
      
      describe('when todos are complete', () => {
        beforeEach(() => {
          props.todo.activeTodoCount = 0
        })

        it('should pass `true` to checked prop', () => {
          assert.hasChildWithProp({
            selector: '.toggle-all',
            prop: 'checked',
            propValue: true
          })
        })
      })
    
      describe('when todos are not complete', () => {
        beforeEach(() => {
          props.todo.activeTodoCount = 3
        })

        it('should pass `true` to checked prop', () => {
          assert.hasChildWithProp({
            selector: '.toggle-all',
            prop: 'checked',
            propValue: false
          })
        })
      })
    
    describe('todo-list TodoItem', () => {
      it('should pass a todo as a prop', () => {
        const todoItem = getComponent().find('.todo-list').find(TodoItem).at(0)
        const actual = todoItem.props().todo
        const expected = props.todo.visibleTodos[0]
        expect(actual).toBe(expected)
      })

      it('should pass view as a prop', () => {
        const todoItem = getComponent().find('.todo-list').find(TodoItem).at(0)
        const actual = todoItem.props().view
        const expected = props.view
        expect(actual).toBe(expected)
      })
    })
  })
})



//     describe('footer', () => {
//       it('should pass calculated completedCount as a prop', () => {
//         const actual = getComponent().find(Footer).props().completedCount
//         const expected = 1
//         expect(actual).toBe(expected)
//       })

//       it('should pass calculated activeCount as a prop', () => {
//         const actual = getComponent().find(Footer).props().activeCount
//         const expected = 1
//         expect(actual).toBe(expected)
//       })

//       it('should pass state.filter to filter prop', () => {
//         const actual = getComponent().instance().state.filter
//         const expected = SHOW_ALL
//         expect(actual).toBe(expected)
//       })

//       it('should pass handleSetFilter method to handleSetFilter prop', () => {
//         const actual = getComponent().find(Footer).props().handleSetFilter
//         const expected = getComponent().instance().handleSetFilter
//         expect(actual).toBe(expected)
//       })

//       it('should pass actions.clearCompleted to clearCompleted prop', () => {
//         const actual = getComponent().find(Footer).props().clearCompleted
//         const expected = props.actions.clearCompleted
//         expect(actual).toBe(expected)
//       })
//     })
//   })
})
