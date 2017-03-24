import React from 'react'
import { mount } from 'enzyme'
import Header from '../Header'
import Entry from '../Entry'
import { Assert } from '../../utils/unit'

fdescribe('Header Component', (Component = Header) => {
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
      addTodo: jest.fn()
    }
    mountedComponent = undefined
  })

  describe('rendering', () => {
    it('should contain correct children', () => {
      assert.hasChildOfType({selector: 'header', type: 'header'})
      assert.hasChildOfType({selector: 'h1', type: 'h1'})
      assert.hasChildOfType({selector: Entry, type: Entry})
    })
  })

  describe('callbacks', () => {
    describe('when saving text having length > 0', () => {
      beforeEach(() => {
        props = {
          addTodo: jest.fn()
        }
      })
      it('should call addTodo with text', () => {
        getComponent().find(Entry).props().handleSave('x')
        expect(props.addTodo).toHaveBeenCalledWith('x')
      })
    })

    describe('when saving text having length = 0', () => {
      beforeEach(() => {
        props = {
          addTodo: jest.fn()
        }
      })
      it('should not call addTodo', () => {
        getComponent().find(Entry).props().handleSave('')
        expect(props.addTodo).not.toHaveBeenCalled()
      })
    })
  })

  describe('props passed to components', () => {
    describe('Entry component', () => {
      it('should set handleSave prop to `handleSave method`', () => {
        assert.hasChildWithProp({
          selector: Entry,
          prop: 'handleSave',
          propValue: getComponent().instance().handleSave
        })
      })
    })
  })
})
