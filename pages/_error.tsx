import Error from 'next/error'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'

const Page: NextPage<ErrorProps> = ({ statusCode }) => {
  return <Error statusCode={statusCode}></Error>
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Page