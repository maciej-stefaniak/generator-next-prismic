import * as React from 'react'
import { useEffect } from 'react'
import * as ReactDOM from 'react-dom'

import { isNode } from '../../utils'

/*
 * This element allows you to render children in a different part of the DOM
 */
type IPortalProps = {
  /*
   * Defines an DOM element id in which the childreen will be render into
   * If not specified, 'portal' will be used
   */
  rootId?: string

  /*
   * Children of the Portal element
   */
  children?: React.ReactNode | React.ReactNode[]
}

export default function Portal(props: IPortalProps) {

  const element: HTMLDivElement = (!isNode) ? document.createElement('div') : null;
  const rootId = props.rootId || 'portal'
  const modalRoot = (!isNode)
    ? document.getElementById(rootId)
    : null;

  useEffect(() => {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    if (modalRoot) {
      modalRoot.appendChild(element)
    }

    return () => {
      if (modalRoot) {
        modalRoot.removeChild(element)
      }
    }
  });

  return (!isNode)
    ? ReactDOM.createPortal(props.children, element)
    : <>{props.children}</>

}
