import React from 'react'
import { Center, Spinner, chakra } from '@chakra-ui/react'

import MemoCard from './MemoCard'
import type { InstituteNews, User, FileUpload, Institute } from '@prisma/client'

import InfiniteScroll from 'react-infinite-scroller'



const MemoList: React.FC = () => {
  const [memos, setMemos] = React.useState<(InstituteNews & {
    user: User;
    uploads: FileUpload[];
    institute: Institute;
  })[]>([])
  
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const onLoadNewMemo = async () => {
    const newMemos = await fetch(`/api/management/news${memos.length > 0 ? `?cursor=${memos[memos.length - 1].id}` : ''}`).then(res => res.json())
    setCount(newMemos?.totalCount ?? 0)

    setMemos((currMemos) => {
      return [...currMemos, ...(newMemos?.data.filter((memo) => !currMemos.find((currMemo) => currMemo.id === memo.id)) ?? []) ]
    })
    setLoading(false)
  }

  React.useEffect(() => {
    onLoadNewMemo()
  }, [])
  return (
    <>
      { !loading ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={onLoadNewMemo}
          hasMore={memos.length < count}
          loader={
            <Center marginTop="2rem" key="infinite-scroll-load">
              <Spinner color="brand.blue" />
            </Center>
          }
          element={chakra.div}
          w="full"
        >
          { memos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
            />
          )) }
        </InfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default MemoList
