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

  const sampleTodo = {
    id: 0,
    title: 'sample',
    completed: false,
    toggle: jest.fn(),
    setTitle: jest.fn(),
    destroy: jest.fn(),
  }

  beforeEach(() => {
    props = {
      todo: {
        todos: [
          { ...sampleTodo, id: 0, title: 'Use Redux'}, 
          { ...sampleTodo, id: 1, title: 'Run the tests', completed: true}, 
        ],
        visibleTodos: [
          { ...sampleTodo, id: 0, title: 'Use Redux'}, 
          { ...sampleTodo, id: 1, title: 'Run the tests', completed: true}, 
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
      it('should set onChange prop to `toggleAll`', () => {
        assert.hasChildWithPropAsAnonymousFn({
          selector: '.toggle-all',
          prop: 'onChange'
        })
      })
      
      describe('when todos are complete', () => {
        beforeEach(() => {
          props.todo.activeTodoCount = 0
        })

        it('should set checked prop to `true` ', () => {
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

        it('should set checked prop to `false`', () => {
          assert.hasChildWithProp({
            selector: '.toggle-all',
            prop: 'checked',
            propValue: false
          })
        })
      })
    })
    
    describe('TodoItem of todo-list', () => {
      it('should set todo prop to `todo`', () => {
        const todoItem = getComponent().find('.todo-list').find(TodoItem).at(0)
        const actual = todoItem.props().todo
        const expected = props.todo.visibleTodos[0]
        expect(actual).toBe(expected)
      })

      it('should set view prop to `view`', () => {
        const todoItem = getComponent().find('.todo-list').find(TodoItem).at(0)
        const actual = todoItem.props().view
        const expected = props.view
        expect(actual).toBe(expected)
      })
    })
  })
})
