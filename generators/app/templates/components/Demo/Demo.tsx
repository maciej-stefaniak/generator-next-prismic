import * as React from 'react'
<% if (addAnimLibrary === 'react-spring') { %>import { useSpring, animated } from 'react-spring'<% } %>

const Demo = () => {
    <% if (addAnimLibrary === 'react-spring') { %>const [imgHovered, setImgHovered] = React.useState(false)
    const imgInitialScale = 1
    const { imgTransform, imgOpacity } = useSpring({
        imgTransform: `scale(${imgHovered ? 1.15 : imgInitialScale})`,
        imgOpacity: imgHovered ? 0.85 : 1,
        config: { mass: 3, tension: 500, friction: 50 }
    })<% } %>

    return (
        <div className="generator-demo-content">
          <<% if (addAnimLibrary === 'react-spring') { %>animated.<% } %>img 
          src="/static/images/demo-illustration.svg" alt="Demo illustration" <% if (addAnimLibrary === 'react-spring') { %>
              onMouseOver={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
              style={{ transform: imgTransform, opacity: imgOpacity }}<% } %>
          />
          <p>
            Welcome to your new project with <b>React/Next.js and Prismic</b>!
            <br />
            Demo component on <b>Page.tsx</b>. Let's remove it
          </p>
        </div>
    )
}

export default Demo;