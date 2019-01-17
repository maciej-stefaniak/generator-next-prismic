import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { isNode } from '../../utils'

/*
  * This element allows you to render children in a different part of the DOM
*/

interface IPortalProps {
  /*
   * Defines an doom element id in which the childreen will be render into
  */
  rootId: string

  /*
   * Children of the Portal element
  */
  children?: React.ReactNode | React.ReactNode[]
}

class Portal extends React.Component<IPortalProps> {
  private element: HTMLDivElement

  constructor(props: IPortalProps) {
    super(props)
    if (!isNode) {
      this.element = document.createElement('div')
    }
  }

  componentDidMount() {
    const { rootId } = this.props
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    if (!isNode) {
      const modalRoot = document.getElementById(rootId)
      if (modalRoot) {
        modalRoot.appendChild(this.element)
      }
    }
  }

  componentWillUnmount() {
    const { rootId } = this.props
    if (!isNode) {
      const modalRoot = document.getElementById(rootId)
      if (modalRoot) {
        modalRoot.removeChild(this.element)
      }
    }
  }

  render() {
    if (!isNode) {
      return ReactDOM.createPortal(this.props.children, this.element)
    }
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

export default Portal
