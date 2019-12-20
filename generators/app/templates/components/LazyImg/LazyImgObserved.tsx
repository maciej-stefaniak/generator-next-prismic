import * as React from 'react'
import { InView } from 'react-intersection-observer'

import useIsIE from '../../hooks/useIsIE'
import { LazyImg } from '../'
import { ILazyImgProps } from './LazyImg'
import { isNode, w } from '../../utils'

const LazyImgObserved: React.FC<ILazyImgProps> = ({
  className = '',
  ...props
}: ILazyImgProps) => {
  const isIE = useIsIE()
  const useObserver =
    !isNode &&
    !isIE &&
    ('IntersectionObserver' in w &&
      'IntersectionObserverEntry' in w &&
      'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
      'isIntersecting' in w.IntersectionObserverEntry.prototype)

  return (
    <>
      {useObserver && (
        <InView triggerOnce>
          {({ inView, ref }) => (
            <LazyImg
              f_ref={ref}
              className={`LazyImgObserved ${className}`}
              {...props}
              src={inView ? props.src : null}
            />
          )}
        </InView>
      )}
      {!useObserver && (
        <LazyImg className={`LazyImgObserved ${className}`} {...props} />
      )}
    </>
  )
}

export default LazyImgObserved
