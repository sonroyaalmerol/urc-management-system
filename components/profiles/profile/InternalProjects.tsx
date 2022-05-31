import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedProject } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import { useRouter } from 'next/router'

const InternalProjects: React.FC<ComponentProps> = (props) => {
  const profile = props.profile

  const [entries, setEntries] = React.useState<ExtendedProject[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/profiles/${profile.id}/projects?${entries.length > 0 && !args?.reset ? `&cursor=${entries[entries.length - 1].id}` : ''}`
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
      title="Internal Projects"
      loading={loading}
      hasMore={entries.length < count}
      loadMore={loadNewEntries}
      onNew={() => {
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/projects`)
      }}
      profileId={profile.id}
    >
      { entries.map((entry) => (
        <CardTemplate
          key={entry.id}
          entry={entry}
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${entry.slug}`}
          role={entry.bridge_profiles.filter((bridge) => bridge.profile_id === profile.id)[0].role_title}
        />
      )) }
    </ListTemplate>
  )
}

export default InternalProjects
