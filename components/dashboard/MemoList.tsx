import React from 'react'
import { Center, Spinner, chakra } from '@chakra-ui/react'

import MemoCard from './MemoCard'
import type { InstituteNews, User, FileUpload, Institute, Profile } from '@prisma/client'
import CustomInfiniteScroll from '../general/CustomInfiniteScroll'

interface MemoListProps {
  institute?: Institute
}

const MemoList: React.FC<MemoListProps> = (props) => {
  const [memos, setMemos] = React.useState<(InstituteNews & {
    profile: Profile;
    uploads: FileUpload[];
    institute: Institute;
  })[]>([])
  
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async () => {
    const newMemos = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/news?${memos.length > 0 ? `&cursor=${memos[memos.length - 1].id}` : ''}${props.institute ? `&institute=${props.institute.id}` : ''}`
    ).then(res => res.json())
    setCount(newMemos?.totalCount ?? 0)

    setMemos((currMemos) => {
      return [...currMemos, ...(newMemos?.data.filter((memo) => !currMemos.find((currMemo) => currMemo.id === memo.id)) ?? []) ]
    })
    setLoading(false)
  }

  React.useEffect(() => {
    loadNewEntries()
  }, [])
  return (
    <>
      { !loading ? (
        <CustomInfiniteScroll
          pageStart={0}
          loadMore={loadNewEntries}
          hasMore={memos.length < count}
        >
          { memos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
            />
          )) }
        </CustomInfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default MemoList
