import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import Error from '../components/general/Error'

const Page: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <Error statusCode={statusCode} />
  )
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Page