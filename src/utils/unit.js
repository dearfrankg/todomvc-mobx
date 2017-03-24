export const DATA_SPEC_ATTRIBUTE_NAME = 'data-spec';

/**
* Finds all instances of components in the rendered `componentWrapper` that are DOM components
* with the `data-spec` attribute matching `name`.
* @param {ReactWrapper} componentWrapper - Rendered componentWrapper (result of mount, shallow, or render)
* @param {string} specName - Name of `data-spec` attribute value to find
* @param {string|Function} typeFilter - (Optional) Expected type of the wrappers (defaults to all HTML tags)
* @returns {ReactComponent[]} All matching DOM components
*/
export const getSpecWrapper = (componentWrapper, specName, typeFilter) => {
    let specWrappers;

    if (!typeFilter) {
        specWrappers = componentWrapper.find(`[${DATA_SPEC_ATTRIBUTE_NAME}="${specName}"]`);
    } else {
        specWrappers = componentWrapper.findWhere((wrapper) => (
            wrapper.prop(DATA_SPEC_ATTRIBUTE_NAME) === specName && wrapper.type() === typeFilter
        ));
    }

    return specWrappers;
}

window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : () => {},
    removeListener: () => {}
  }
}

export class Assert {
  static create = (getComponent) => new Assert(getComponent)

  constructor (getComponent) {
    this.getComponent = getComponent
  }
  
  isType = ({type}) => {
    const actual = this.getComponent().type()
    const expected = type
    expect(actual).toBe(expected)
  }

  hasChildOfType = ({selector, type}) => {
    const actual = this.getComponent().find(selector).type()
    const expected = type
    expect(actual).toBe(expected)
  }

  hasChildWithText = ({selector, text}) => {
    const actual = this.getComponent().find(selector).text()
    const expected = text
    expect(actual).toBe(expected)
  }

  hasChildWithClass = ({selector, className}) => {
    const actual = this.getComponent().find(selector).hasClass(className)
    const expected = true
    expect(actual).toBe(expected)
  }

  hasChildWithoutClass = ({selector, className}) => {
    const actual = this.getComponent().find(selector).hasClass(className)
    const expected = false
    expect(actual).toBe(expected)
  }

  hasChildWithProp = ({selector, prop, propValue}) => {
    if (! prop in this.getComponent().find(selector).props()) {
      throw('hasChildWithProp: selector does not have this prop')
    }
    const actual = this.getComponent().find(selector).props()[prop]
    const expected = propValue
    expect(actual).toBe(expected)
  }

  hasChildWithPropAsAnonymousFn = ({selector, prop, propValue}) => {
    const actual = typeof this.getComponent().find(selector).props()[prop]
    const expected = 'function'
    expect(actual).toBe(expected)
  }

  isPresent = ({selector}) => {
    const actual = this.getComponent().find(selector).length
    const expected = 1
    expect(actual).toBe(expected)
  }

  isNotPresent = ({selector}) => {
    const actual = this.getComponent().find(selector).length
    const expected = 0
    expect(actual).toBe(expected)
  }

  simulateEvent = ({selector, simulateArgs}) => {
    this.getComponent().find(selector).simulate(...simulateArgs)
    this.getComponent().instance().forceUpdate()
  }

  createMockMethod = ({methodName}) => {
    const instance = this.getComponent().instance()
    const mockedMethod = instance[methodName] = jest.fn()
    instance.forceUpdate()
    return mockedMethod
  }

  setRef = ({refName, value}) => {
    this.getComponent().ref(refName).get(0).value = value
  }

  getRef = ({refName, value}) => {
    return this.getComponent().ref(refName).get(0).value
  }

  refHasValue = ({refName, value}) => {
    const actual = this.getComponent().ref(refName).get(0).value
    const expected = value
    expect(actual).toBe(expected)
  }

}