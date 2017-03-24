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
    describe('when onKeyDown event with ENTER key', () => {
      it('should clear input component value', () => {
        assert.setRef({refName: 'newField', value: 'funny'})
        assert.simulateEvent({
          selector: '.new-todo', 
          simulateArgs: [
            'keydown', 
            {which: 13, target: {value: 'hello'}}
          ]
        })
        assert.refHasValue({refName: 'newField', value: ''})

      })
    })
  })

  describe('callbacks', () => {
    describe('input component', () => {
      describe('when onKeyDown event with ENTER key', () => {
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
    describe('input component', () => {
      it('should set type prop to `text`', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'type',
          propValue: 'text'
        })
      })

      it('should set placeholder prop to `What needs to be done?`', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'placeholder',
          propValue: 'What needs to be done?'
        })
      })

      it('should set onKeyDown prop to `handleKeyDown method`', () => {
        assert.hasChildWithProp({
          selector: 'input',
          prop: 'onKeyDown',
          propValue: getComponent().instance().handleKeyDown
        })
      })
    })
  })
})
