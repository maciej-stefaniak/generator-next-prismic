import * as React from 'react'
import { mount, shallow, render } from 'enzyme'
import { default as Demo } from './../Demo'

describe('Demo component', () => {

  it('Contains one image and one paragraph', () => {
    const wrapper = mount(<Demo />) // shallow is not enough right now as enzyme doesn't support it yet

    expect(wrapper.find('p').length).toEqual(1)
    expect(wrapper.find('img').length).toEqual(1)
  })

})
