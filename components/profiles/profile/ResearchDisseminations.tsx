import React from 'react'
import ListTemplate from './ListTemplate'

import type { ComponentProps, ExtendedResearchDissemination } from '../../../types/profile-card'
import CardTemplate from './CardTemplate'

const ResearchDisseminations: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [entries, setEntries] = React.useState<ExtendedResearchDissemination[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `/api/management/profiles/${profile.id}/research_disseminations?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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

  return (
    <ListTemplate
      title="Research Disseminations"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
    >
      { entries.map((entry) => (
        <CardTemplate key={entry.id} entry={entry} />
      )) }
    </ListTemplate>
  )
}

export default ResearchDisseminations
