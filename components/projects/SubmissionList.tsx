import React from 'react'
import { Center, Spinner, chakra, VStack } from '@chakra-ui/react'

import type { Profile, BudgetProposalSubmission, FileUpload, CapsuleProposalSubmission, FullBlownProposalSubmission, DeliverableSubmission, Submission, User, Project, Deliverable } from '@prisma/client'

import { useDebounce } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroller'
import SubmissionCard from './SubmissionCard'

interface ProjectListProps {
  types?: string[],
  projectId: string,
  status?: string[]
}

const SubmissionList: React.FC<ProjectListProps> = (props) => {
  const [entries, setEntries] = React.useState<(
    Partial<(Submission & {
      profile: Profile & {
          user: User;
      };
      capsule_proposal_submission: CapsuleProposalSubmission;
      full_blown_proposal_submission: FullBlownProposalSubmission;
      deliverable_submission: DeliverableSubmission & {
        deliverable: Deliverable;
      };
      budget_proposal_submission: BudgetProposalSubmission;
      files: FileUpload[];
      project: Project;
    })>
  )[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects/${props.projectId}?${props.types?.length > 0 ? `&types=${props.types.join(',')}` : ''}${props.status?.length > 0 ? `&status=${props.status}` : ''}`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    } else {
      setEntries((currEntries) => {
        return [...currEntries, ...(newEntries?.data.filter((memo) => !currEntries.find((currEntry) => currEntry.id === memo.id)) ?? []) ]
      })
    }
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries({ reset: true })
  }, [props.types, props.status])
  return (
    <>
      { !loading ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadNewEntries}
          hasMore={entries.length < count}
          loader={
            <Center marginTop="2rem" key="infinite-scroll-load">
              <Spinner color="brand.blue" />
            </Center>
          }
          element={chakra.div}
          w="full"
        >
          <VStack w="full">
            { entries.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            )) }
          </VStack>
        </InfiniteScroll>
      ) : (
        <Center marginTop="2rem">
          <Spinner color="brand.blue" />
        </Center>
      ) }
    </>
  )
}

export default SubmissionList
