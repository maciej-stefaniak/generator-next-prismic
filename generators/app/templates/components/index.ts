export { default as Layout } from './Layout/Layout'
export { default as Footer } from './Footer/Footer'
export { default as Navbar } from './Navbar/Navbar'

<% if (baseComponents.includes('MetaData')) { %>export { default as MetaData } from './MetaData/MetaData'<% } %>
<% if (baseComponents.includes('Markdown')) { %>export { default as Markdown } from './Markdown/Markdown'<% } %>
<% if (baseComponents.includes('LazyImg')) { %>export { default as LazyImg } from './LazyImg/LazyImg'<% } %>
<% if (baseComponents.includes('LazyImg')) { %>export { default as LazyImgObserved } from './LazyImg/LazyImgObserved'<% } %>
<% if (baseComponents.includes('Portal')) { %>export { default as Portal } from './Portal/Portal'<% } %>
<% if (baseComponents.includes('Link')) { %>export { default as Link } from './Link/Link'<% } %>
<% if (baseComponents.includes('Button')) { %>export { default as Button } from './Button/Button'<% } %>
<% if (baseComponents.includes('PageTransitions')) { %>export { default as PageTransitions } from './PageTransitions/PageTransitions'<% } %>

// Add here the imports of the particular content-blocks

// Renderer of Content Blocks. Needs to be below any content-block import
<% if (baseComponents.includes('ContentBlocks')) { %>export { default as ContentBlock } from './ContentBlocks/ContentBlocks'<% } %>

<% if (baseComponents.includes('Demo')) { %>// TODO: To be deleted after creating the project
export { default as Demo } from './Demo/Demo'<% } %>

<% if (baseComponents.includes('Anims')) { %>
// Anim helpers
export { default as Transform } from './Anims/Transform'
export { default as AnimOnScroll } from './AnimOnScroll/AnimOnScroll'<% } %>
