import * as React from 'react'

interface IErrorPageProps {
  error?: string
}

const ErrorPage: React.SFC<IErrorPageProps> = ({
  error = '404 - Not Found'
}) => {
  return (
    <section className="Error-page">
      <h1>{error}</h1>
    </section>
  )
}
export default ErrorPage
