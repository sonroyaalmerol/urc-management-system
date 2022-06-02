import React from 'react'

import ListTemplate from '../../general/templates/ListTemplate'

import type { ComponentProps, ExtendedProject } from '../../../types/profile-card'
import CardTemplate from '../../general/templates/CardTemplate'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { roleChecker } from '../../../utils/roleChecker'
import { CREATE_PROJECT } from '../../../utils/permissions'

const InternalProjects: React.FC<ComponentProps> = (props) => {
  const profile = props.profile
  const session = useSession()

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
        router.push(`/projects`)
      }}
      profileId={profile.id}
      disabled={profile.id !== session.data.profile.id || !(roleChecker(session.data.profile, CREATE_PROJECT))}
    >
      { entries.map((entry) => (
        <CardTemplate
          key={entry.id}
          entry={entry}
          href={session.data.profile.id === profile.id ? `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${entry.slug}` : undefined}
          role={entry.bridge_profiles.filter((bridge) => bridge.profile_id === profile.id)[0].role_title}
        />
      )) }
    </ListTemplate>
  )
}

export default InternalProjects
