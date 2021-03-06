import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedProject } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'

const InternalProjects: React.FC<ComponentProps> = (props) => {
  const institute = props.institute
  const session = useSession()

  const [entries, setEntries] = React.useState<ExtendedProject[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/institutes/${institute.id}/projects?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
    loadNewEntries()
  }, [])

  const router = useRouter()

  return (
    <ListTemplate
      title="Projects"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      onNew={() => {
        router.push(`/projects`)
      }}
      disabled={true}
    >
      { entries.map((entry) => (
        <CardTemplate
          key={entry.id}
          entry={entry}
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${entry.slug}`}
        />
      )) }
    </ListTemplate>
  )
}

export default InternalProjects
