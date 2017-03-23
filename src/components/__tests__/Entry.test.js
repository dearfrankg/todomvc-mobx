import React from 'react'
import { mount } from 'enzyme'
import Entry from '../Entry'
import { Assert } from '../../utils/unit'

describe('Entry Component', (Component = Entry) => {
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
      handleSave: jest.fn()
    }
    mountedComponent = undefined
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      assert.hasChildOfType({selector: 'input', type: 'input'})
    })
  })

  describe('callbacks', () => {
    describe('input field', () => {
      describe('when onKeyDown event then ENTER key', () => {
        it('should call handleSave callback', () => {
          const eventData = {which: 13, target: {value: 'hello'}}
          assert.simulateEvent({selector: '.new-todo', simulateArgs: ['keydown', eventData]})
          expect(props.handleSave).toHaveBeenCalledWith('hello')
        })
      })

      describe('when onKeyDown event without ENTER key', () => {
        it('should not call handleSave callback', () => {
          const eventData = {target: {value: 'hello'}}
          assert.simulateEvent({selector: '.new-todo', simulateArgs: ['keydown', eventData]})
          expect(props.handleSave).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('props passed to components', () => {
    describe('input', () => {
      it('should pass text to type prop', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'type',
          propValue: 'text'
        })
      })

      it('should pass "What needs to be done?" to placeholder prop', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'placeholder',
          propValue: 'What needs to be done?'
        })
      })

      it('should pass handleKeyDown method to onKeyDown prop', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'onKeyDown',
          propValue: getComponent().instance().handleKeyDown
        })
      })
    })
  })
})
