import React from 'react'
import { mount } from 'enzyme'
import Footer from '../Footer'
import { Assert, getSpecWrapper } from '../../utils/unit'
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from '../../constants'

describe('Footer Component', (Component = Footer) => {
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
      view: {
        todoFilters: [SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED],
        todoFilter: SHOW_ALL
      },
      todo: {
        todos: [ {}, {} ],
        activeTodoCount: 5,
        completedCount: 5
      },
    }
    mountedComponent = undefined
  })

  describe('rendering', () => {
    describe('when todos exist', () => {
      beforeEach(() => {
        props.todo.todos = [ {}, {} ]
      })

      it('should contain correct children', () => {
      assert.hasChildOfType({selector: 'footer', type: 'footer'})
      assert.hasChildOfType({selector: '.todo-count', type: 'span'})
      assert.hasChildOfType({selector: '.filters', type: 'ul'})

      const filters = getComponent().find('.filters')
      const filtersArray = [SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED]
      filtersArray.forEach((filter, i) => {
        const li = filters.children().at(i)
        expect(li.type()).toBe('li')
        const a = li.children().at(0)
        expect(a.type()).toBe('a')
        expect(a.text()).toBe(['All', 'Active', 'Completed'][i])
        expect(a.hasClass('selected')).toBe(i == 0 ? true : false)
      })

      assert.hasChildOfType({selector: '.clear-completed', type: 'button'})
      assert.hasChildWithText({selector: '.clear-completed', text: 'Clear completed'})
      })
    })

    describe('when no todos exist', () => {
      beforeEach(() => {
        props.todo.todos = []
      })

      it('should not render', () => {
        assert.isNotPresent({selector: 'footer'})
      })
    })

    describe('when activeTodoCount is 0', () => {
      beforeEach(() => {
        props.todo.activeTodoCount = 0,
        props.todo.activeTodoWord = 'items'
      })

      it('should render todo count as "No items left"', () => {
        assert.hasChildWithText({selector: '.todo-count', text: 'No items left'})
      })
    })

    describe('when activeCount is 1', () => {
      beforeEach(() => {
        props.todo.activeTodoCount = 1,
        props.todo.activeTodoWord = 'item'
      })

      it('should render todo count as "1 item left"', () => {
        assert.hasChildWithText({selector: '.todo-count', text: '1 item left'})
      })
    })

    describe('when activeCount is 2', () => {
      beforeEach(() => {
        props.todo.activeTodoCount = 2,
        props.todo.activeTodoWord = 'items'
      })

      it('should render todo count as "2 items left"', () => {
        assert.hasChildWithText({selector: '.todo-count', text: '2 items left'})
      })
    })

    describe('when completedCount is 0', () => {
      beforeEach(() => {
        props.todo.completedCount = 0
      })

      it('should not render clear-completed button', () => {
        assert.isNotPresent({selector: '.clear-completed'})
      })
    })

    describe('when completedCount is > 0', () => {
      beforeEach(() => {
        props.todo.completedCount = 3
      })

      it('should render clear-completed button', () => {
        assert.isPresent({selector: '.clear-completed'})
      })
    })
  })

  describe('callbacks', () => {
    describe('when clicking on filter link', () => {
      it('should navigate to the correct url', () => {
        const filters = getComponent().find('.filters')
        const filtersArray = [SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED]
        filtersArray.forEach((filter, i) => {
          const a = filters.children().at(i).children().at(0)
          const actual = a.props().href
          const expected = ['#/', '#/active', '#/completed'][i]
          expect(actual).toBe(expected)
        })
      })
    })

    describe('when clicking on clear-completed button', () => {
      beforeEach(() => {
        props.todo.clearCompleted = jest.fn()
      })
      it('should call clearCompleted', () => {
        const clearCompleted = getComponent().props().todo.clearCompleted
        assert.simulateEvent({
          selector: '.clear-completed', 
          simulateArgs: ['click']
        })
        expect(clearCompleted).toHaveBeenCalled()
      })
    })
  })

  describe('props passed to components', () => {
    describe('filter link', () => {
      describe('when filter link matches todoFilter', () => {
        beforeEach(() => {
          props.view.todoFilter = SHOW_ACTIVE
        })
        it('should set className prop to `selected`', () => {
          const actual = getComponent().find('a').at(1).props().className
          const expected = 'selected'
          expect(actual).toBe(expected)
        })
      })
    })

    describe('clear-completed button', () => {
      beforeEach(() => {
        props.todo.clearCompleted = jest.fn()
      })
      it('should set onClick prop to `todo.clearCompleted`', () => {
        assert.hasChildWithProp({
          selector: '.clear-completed', 
          prop: 'onClick', 
          propValue: getComponent().props().todo.clearCompleted
        })
      })
    })
  })
})







