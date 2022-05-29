import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedProfile } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import { useRouter } from 'next/router'
import InnerProfileCard from '../../projects/InnerProfileCard'

const Members: React.FC<ComponentProps> = (props) => {
  const institute = props.institute

  const [entries, setEntries] = React.useState<ExtendedProfile[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/institutes/${institute.id}/members?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
      title="Members"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      onNew={() => {
        // router.push(`/projects`)
      }}
    >
      { entries.map((entry) => (
        <InnerProfileCard
          key={entry.id}
          profile={entry}
          role={entry.bridge_institutes?.filter((i) => i.institute_id === institute.id)[0].role_title}
        />
      )) }
    </ListTemplate>
  )
}

export default Members
