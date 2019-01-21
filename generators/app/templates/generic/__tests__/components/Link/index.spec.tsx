import * as React from 'react'
import { mount, shallow, render } from 'enzyme' // 'mount' for testing full lifecycle
import Link from './../../../components/Link'

describe('Link component', () => {
  describe('Test group', () => {
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
  })
})
