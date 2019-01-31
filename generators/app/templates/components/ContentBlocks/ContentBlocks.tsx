import * as React from 'react'

const COMPONENTS = {
  /* 
    Name_component: NameComponent
  */
}

type IContentBlockProps = {
  /**
   * Name that represents the component to be used
   */
  tag: string
  primary?: any
}

const ContentBlock: React.SFC<IContentBlockProps> = props => {
  const {
    tag,
    primary: { is_hidden = 'No' }
  } = props

  if (!tag) return null

  const TagName = COMPONENTS[tag]

  if (!TagName) return null

  if (is_hidden === 'Yes') return null

  return <TagName {...props} />
}

export default ContentBlock
