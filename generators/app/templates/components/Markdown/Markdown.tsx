import * as React from 'react'
import './styles.scss'

import { cta } from '../../utils'

type IMarkdownProps = {
  input: { text: string }[]
  unWrapParagraphs?: boolean
  className?: string
}

const Markdown: React.SFC<IMarkdownProps> = ({
  input,
  unWrapParagraphs = true,
  className = ''
}) => (
  <div className={`Markdown ${className}`}>
    {unWrapParagraphs ? (
      <p>{cta(input, unWrapParagraphs)}</p>
    ) : (
      cta(input, unWrapParagraphs)
    )}
  </div>
)

export default Markdown
