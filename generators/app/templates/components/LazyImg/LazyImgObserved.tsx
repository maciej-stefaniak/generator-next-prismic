import * as React from 'react'
import { InView } from 'react-intersection-observer'

import { LazyImg } from '../'
import { ILazyImgProps } from './LazyImg'
import { isNode, w } from '../../utils'

const LazyImgObserved: React.FC<ILazyImgProps> = (props: ILazyImgProps) => {
  const useObserver =
    !isNode &&
    ('IntersectionObserver' in w &&
      'IntersectionObserverEntry' in w &&
      'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
      'isIntersecting' in w.IntersectionObserverEntry.prototype)

  return useObserver ? (
    <InView triggerOnce>
      {({ inView, ref }) => (
        <span ref={ref}>
          <LazyImg {...props} src={inView ? props.src : null} />
        </span>
      )}
    </InView>
  ) : (
    <LazyImg {...props} />
  )
}

export default LazyImgObserved
