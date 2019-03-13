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
    const expectedLink = 'mailto:email@domain.com'
    const link1 = mount(<Link url="mailto:email@domain.com">title</Link>)
    expect(link1.find('a').text()).toBe('title')
    expect(link1.find('a').props().href).toBe(expectedLink)
    
    const link2 = mount(<Link url="email@domain.com">title</Link>)
    expect(link2.find('a').props().href).toBe(expectedLink)
    
    const link3 = mount(<Link type="mailto" url="mailto:email@domain.com">title</Link>)
    expect(link3.find('a').props().href).toBe(expectedLink)
    
    const link4 = mount(<Link type="mailto" url="email@domain.com">title</Link>)
    expect(link4.find('a').props().href).toBe(expectedLink)
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

  it('Is external link rendered properly without implicit type', () => {
    const linkHttp = mount(
      <Link url="http://domain.com">
        External link
      </Link>
    )
    const linkHttps = mount(
      <Link url="https://domain.com">
        External link
      </Link>
    )

    expect(linkHttp.find('a').props().href).toBe('http://domain.com')
    expect(linkHttp.find('a').props().rel).toBe('noopener')
    expect(linkHttp.find('a').props().target).toBe('_blank')
    
    expect(linkHttps.find('a').props().href).toBe('https://domain.com')
    expect(linkHttps.find('a').props().rel).toBe('noopener')
    expect(linkHttps.find('a').props().target).toBe('_blank')
  })
})
