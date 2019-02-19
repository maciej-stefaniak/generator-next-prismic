import * as React from 'react'
import { mount, shallow } from 'enzyme'
import { default as LazyImg } from './../LazyImg'

describe('LazyImg component', () => {

  it('correctly sets src inline placeholder (gif 1x1)', () => {
    const wrapper = mount(<LazyImg src='' />)

    expect(wrapper.find('img').prop('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
  })

  it('correctly sets src', () => {
    const wrapper = mount(<LazyImg src='https://source.unsplash.com/random/800x600' />)

    // setTimeout to make it  execute after the rest of synchronous code
    setTimeout(() => {
      expect(wrapper.find('img').prop('src')).toEqual('https://source.unsplash.com/random/800x600')
    }, 0);
  })

  it('correctly sets background color', () => {
    const wrapper = mount(<LazyImg src='' backgroundColor='#ff00ff' />)

    expect(wrapper.find('span').first().prop('style')).toHaveProperty('background',  '#ff00ff')
  })

  it('correctly sets background image', () => {
    const wrapper = mount(<LazyImg src='https://source.unsplash.com/random/800x600' isBackground={true} />)

    // setTimeout to make it  execute after the rest of synchronous code
    setTimeout(() => {
      expect(wrapper.find('span').first().find('div').prop('style')).toHaveProperty('background-image',  'https://source.unsplash.com/random/800x600');
    }, 0);
  })

  it('correctly sets classname', () => {
    const wrapper = mount(<LazyImg src='' className='weirdClassName' />)
    expect(wrapper.find('span').first().prop('className')).toContain('weirdClassName')
  })

  it('correctly handles onElick callback', () => {
    window.alert = jest.fn();
    const wrapper = mount(<LazyImg src='' onClick={() => {alert('clicked')}}/>)
    wrapper.simulate('click')
    expect(window.alert).toHaveBeenCalledWith('clicked');
  })

  it('correctly handles non-exisiting image', () => {
    const wrapper = mount(<LazyImg src='INCORRECT IMAGE PATH' />)
    // setTimeout to make it  execute after the rest of synchronous code
    setTimeout(() => {
      expect(wrapper.find('span').first().prop('className')).toContain('failed')
      expect(wrapper.find('span').first().prop('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
    })
  })
  
  
})
