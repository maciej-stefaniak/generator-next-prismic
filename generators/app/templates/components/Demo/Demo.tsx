import * as React from 'react'

import { LazyImg, Transform } from '../'

const Demo = () => (
  <div className="generator-demo-content">
    <Transform from={[0, 0, 1.35, -15]} delay={350}>
      <LazyImg
        src="/static/images/demo-illustration.svg"
        alt="Demo illustration"
        spaceHolderFix={65.8}
        style={{
          width: '350px'
        }}
      />
    </Transform>
    <p>
      Welcome to your new project with <b>React/Next.js and Prismic</b>!
      <br />
      Demo component on <b>Page.tsx</b>. Let's remove it
    </p>
  </div>
)

export default Demo
