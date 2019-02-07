import * as React from 'react'
import { mount, shallow, render } from 'enzyme' // 'mount' for testing full lifecycle
import { default as Link } from './../../../components/Link/Link'

describe('Link component', () => {
  it('Is mailto link rendered properly', () => {
    const testData = {
      type: 'mailto',
      url: 'email@domain.com',
      title: 'anchor'
    }
    const wrapper = mount(
      <Link type="mailto" url="email@domain.com" title="anchor" />
    )
    expect(wrapper.find('a').text()).toBe(testData.title)
  })
  it('Is external link rendered properly', () => {
    const testData = {
      type: 'external',
      url: 'http://domain.com',
      title: 'External link'
    }
    const wrapper = mount(
      <Link type="external" url="http://domain.com" title="External link" />
    )
    // All expectations must be met to pass test
    expect(wrapper.find('a').props().href).toBe(testData.url)
    expect(wrapper.find('a').props().rel).toBe('noopener')
    expect(wrapper.find('a').props().target).toBe('_blank')
  })
})
