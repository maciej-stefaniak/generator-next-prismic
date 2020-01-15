import * as React from 'react'

import { LazyImg, Transform,
  Button<% if (baseComponents.includes('GoogleMap')) { %>,
  GoogleMap<% } %>
} from '../'

import DemoForm from './DemoForm'

type TDemoProps = {
  lang: string
  addButton?: boolean
  addForm?: boolean
  addGMaps?: boolean
}

const Demo = ({
  lang, 
  addButton = false, 
  addForm = false, 
  addGMaps = false
}: TDemoProps) => (<div className="generator-demo-content">
      <p>
        Welcome to your new project with <b>React/Next.js and Prismic</b>!
        <br />
        Demo component on <b>Page.tsx</b>. Let's remove it
      </p>
      <Transform from={[0, 0, 1.35, -15]} delay={350}>
        <LazyImg
          src="/static/images/demo-illustration.svg"
          alt="Demo illustration"
          spaceHolderFix={65.8}
          style={{
            width: '350px',
            marginBottom: '20px'
          }}
        />
      </Transform>
      {(addButton || addForm || addGMaps) &&<div className="generator-white-wrapper">
        {addForm && <DemoForm lang={lang} />}
        {addButton && <p><Button>Button component</Button></p>}
        {addGMaps && <GoogleMap gpsPosition={{latitude: 53.5498002, longitude: 9.9943386}}/>}
      </div>}
    </div>)

export default Demo
