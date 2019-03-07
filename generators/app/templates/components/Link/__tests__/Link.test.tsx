import * as React from 'react'
import { mount, shallow, render } from 'enzyme' // 'mount' for testing full lifecycle
import { default as Link } from './../Link'
const { Link: InternalLink } = require('./../../../server/routes')

describe('Link component', () => {
  it('Is internal link rendered properly', () => {
    const wrapper = mount(
      <Link type="internal" url="email@domain.com">
        title
      </Link>
    )

    expect(wrapper.find(InternalLink).length).toEqual(1)
    expect(wrapper.find('a span').text()).toBe('title')
  })

  it('Is mailto link rendered properly', () => {
    const wrapper = mount(
      <Link type="mailto" url="email@domain.com">
        title
      </Link>
    )

    expect(wrapper.find('a').text()).toBe('title')
    expect(wrapper.find('a').props().href).toBe('email@domain.com')
  })

  it('Is external link rendered properly', () => {
    const wrapper = mount(
      <Link type="external" url="http://domain.com">
        External link
      </Link>
    )

    expect(wrapper.find('a').props().href).toBe('http://domain.com')
    expect(wrapper.find('a').props().rel).toBe('noopener')
    expect(wrapper.find('a').props().target).toBe('_blank')
  })
})
