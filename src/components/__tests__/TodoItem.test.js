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
        todoBeingEdited: {}
      }
    }
    mountedComponent = undefined
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      assert.isType({type: TodoItem})
      assert.isPresent({selector: 'li'})
      assert.isPresent({selector: '.view'})
      assert.isPresent({selector: '.toggle'})
      assert.isPresent({selector: 'label'})
      assert.isPresent({selector: 'button'})
      assert.isPresent({selector: '.edit'})
    })

    describe('when todo is not double-clicked', () => {
      beforeEach(() => {
        props.todo = {id: 0, text: 'fun', completed: true}
      })

      it('should render without className `editing`', () => {
        assert.hasChildWithoutClass({
          selector: 'li',
          className: 'editing'
        })
      })
    })

    describe('when todo is double-clicked', () => {
      beforeEach(() => {
        props.todo = {id: 0, text: 'fun', completed: true}
      })

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
        props.todo = {id: 0, text: 'fun', completed: true}
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
          const handleSubmitMethod = assert.createMockMethod({methodName: 'handleSubmit'})
          assert.simulateEvent({
            selector: '.edit', 
            simulateArgs: [
              'keydown', 
              {which: 13, target: {value: 'xxx'}}
            ]
          })
          expect(handleSubmitMethod).toHaveBeenCalled()
        })
      })

      describe('when onKeyDown with ESC key', () => {
        it('should call handleChange method', () => {
          const ESCAPE_KEY = 27
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
      xit('should pass `todo.title` to value prop', () => {
        assert.simulateEvent({selector: 'label', simulateArgs: ['doubleclick']})
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'value', 
          propValue: getComponent().instance().editText
        })
      })

      it('should pass `handleSubmit` method to onBlur prop', () => {
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onBlur', 
          propValue: getComponent().instance().handleSubmit
        })
      })

      it('should pass `handleChange` method to onChange prop', () => {
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onChange', 
          propValue: getComponent().instance().handleChange
        })
      })

      it('should pass `handleKeyDown` method to onKeyDown prop', () => {
        assert.hasChildWithProp({
          selector: '.edit', 
          prop: 'onKeyDown', 
          propValue: getComponent().instance().handleKeyDown
        })
      })
    })
  })
})
