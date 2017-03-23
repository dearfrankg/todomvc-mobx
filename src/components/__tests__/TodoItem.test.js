import React from 'react'
import { mount } from 'enzyme'
import TodoItem from '../TodoItem'
import Entry from '../Entry'
import { Assert } from '../../utils/unit'

describe('TodoItem Component', (Component = TodoItem) => {
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
        id: 0,
        title: 'use redux',
        completed: false,
        toggle: jest.fn(),
        setTitle: jest.fn(),
        destroy: jest.fn(),
      },
      view: {
        todoBeingEdited: null
      }
    }
    mountedComponent = undefined
  })

  describe('rendering', () => {
    describe('when in view mode', () => {
      it('should render correctly', () => {
        assert.isType({type: TodoItem})
        assert.isPresent({selector: 'li'})
        assert.isPresent({selector: '.view'})
        assert.isPresent({selector: '.toggle'})
        assert.isPresent({selector: 'label'})
        assert.isPresent({selector: 'button'})
      })
    })

    describe('when in edit mode', () => {
      it('should render correctly', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleClick']})
        assert.isType({type: TodoItem})
        assert.isPresent({selector: 'li'})
        assert.isPresent({selector: '.edit'})
      })
    })

    describe('when todo is not double-clicked', () => {
      it('should render without className `editing`', () => {
        assert.hasChildWithoutClass({
          selector: 'li',
          className: 'editing'
        })
      })
    })

    describe('when todo is double-clicked', () => {
      it('should render with className `editing`', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleClick']})
        assert.hasChildWithClass({
          selector: 'li',
          className: 'editing'
        })
      })
    })

    describe('when todo is complete', () => {
      beforeEach(() => {
        props.todo.completed = true
      })

      it('should render li with class "completed"', () => {
        assert.hasChildWithClass({selector: 'li', className: 'completed'})
      })
    })
  })

  describe('callbacks', () => {
    describe('when in edit mode', () => {
      describe('when onBlur and text.length > 0', () => {
        it('should call setTitle callback and exit edit mode', () => {
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          assert.hasChildWithClass({selector: 'li', className: 'editing'})
          const eventData = {target: {value: 'hello'}}
          assert.simulateEvent({selector: '.edit', simulateArgs: ['blur', eventData]})
          expect(props.todo.setTitle).toHaveBeenCalledWith('hello')
          expect(props.view.todoBeingEdited).toBe(null)
        })
      })

      describe('when onBlur and text.length = 0', () => {
        it('should call deleteTodo and exit edit mode', () => {
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          assert.hasChildWithClass({selector: 'li', className: 'editing'})
          const eventData = {target: {value: ''}}
          assert.simulateEvent({selector: '.edit', simulateArgs: ['blur', eventData]})
          expect(props.todo.destroy).toHaveBeenCalled()
          expect(props.view.todoBeingEdited).toBe(null)
        })
      })

      describe('when onChange', () => {
        it('should call handleChange method', () => {
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          assert.simulateEvent({
            selector: '.edit', 
            simulateArgs: [
              'change', 
              {target: {value: 'xxx'}}
            ]
          })
          const instance = getComponent().instance()
          expect(instance.editText).toBe('xxx')
        })
      })

      describe('when onKeyDown with ENTER key', () => {
        it('should call handleKeyDown and handleSubmit methods', () => {
          const ENTER_KEY = 13
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          // const handleSubmitMethod = assert.createMockMethod({methodName: 'handleSubmit'})
          assert.simulateEvent({
            selector: '.edit', 
            simulateArgs: [
              'keydown', 
              {which: ENTER_KEY, target: {value: 'xxx'}}
            ]
          })
          expect(props.view.todoBeingEdited).toBe(null)
        })
      })

      describe('when onKeyDown with ESC key', () => {
        it('should call handleChange method', () => {
          const ESCAPE_KEY = 27
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          assert.simulateEvent({
            selector: '.edit', 
            simulateArgs: [
              'keydown', 
              {which: ESCAPE_KEY, target: {value: 'xxx'}}
            ]
          })
          const instance = getComponent().instance()
          expect(instance.editText).toBe(props.todo.title)
        })
      })

      describe('when onKeyDown without ESC or ENTER key', () => {
        it('should call handleChange method but not execute anything', () => {
          const ESCAPE_KEY = 27
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          const handleSubmitMethod = assert.createMockMethod({methodName: 'handleSubmit'})
          assert.simulateEvent({
            selector: '.edit', 
            simulateArgs: [
              'keydown', 
              {which: 44, target: {value: 'xxx'}}
            ]
          })
          const instance = getComponent().instance()
          expect(instance.editText).toBe('use redux')
          expect(handleSubmitMethod).not.toHaveBeenCalled()
        })
      })
    })

    describe('when in view mode', () => {
      describe('when clicking toggle', () => {
        it('should call toggle callback', () => {
          assert.simulateEvent({selector: '.toggle', simulateArgs: ['change']})
          expect(props.todo.toggle).toHaveBeenCalled()
        })
      })

      describe('when label is doubleclicked', () => {
        it('should enter edit mode', () => {
          assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
          expect(props.todo).toBe(props.view.todoBeingEdited)
        })
      })

      describe('when delete button is clicked', () => {
        it('should call deleteTodo', () => {
          assert.simulateEvent({selector: '.destroy', simulateArgs: ['click']})
          expect(props.todo.destroy).toHaveBeenCalled()
        })
      })
    })
  })

  describe('props passed to components', () => {
    describe('toggle checkbox', () => {
      it('should pass `checkbox` to type prop', () => {
        assert.hasChildWithProp({
          selector: '.toggle', 
          prop: 'type', 
          propValue: 'checkbox'
        })
      })

      it('should pass `todo.completed` to checked prop', () => {
        assert.hasChildWithProp({
          selector: '.toggle', 
          prop: 'checked', 
          propValue: props.todo.completed
        })
      })

      it('should pass `todo.toggle` to onChange prop', () => {
        assert.hasChildWithProp({
          selector: '.toggle', 
          prop: 'onChange', 
          propValue: props.todo.toggle
        })
      })
    })

    describe('label', () => {
      it('should pass `handleDoubleClick` method to onDoubleClick prop', () => {
        assert.hasChildWithProp({
          selector: 'label', 
          prop: 'onDoubleClick', 
          propValue: getComponent().instance().handleDoubleClick
        })
      })
    })

    describe('destroy button', () => {
      it('should pass `destroy` callback to onClick prop', () => {
        assert.hasChildWithProp({
          selector: '.destroy', 
          prop: 'onClick', 
          propValue: props.todo.destroy
        })
      })
    })

    describe('edit field', () => {
      it('should pass `todo.title` to value prop', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'value', 
          propValue: getComponent().instance().editText
        })
      })

      it('should pass `handleSubmit` method to onBlur prop', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onBlur', 
          propValue: getComponent().instance().handleSubmit
        })
      })

      it('should pass `handleChange` method to onChange prop', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onChange', 
          propValue: getComponent().instance().handleChange
        })
      })

      it('should pass `handleKeyDown` method to onKeyDown prop', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onKeyDown', 
          propValue: getComponent().instance().handleKeyDown
        })
      })
    })
  })
})
