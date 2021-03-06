import React from 'react'
import ContentHeader from '../../components/general/ContentHeader'
import { getSession } from 'next-auth/react'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"

import { NextSeo } from 'next-seo'
import { HStack, Select, VStack } from '@chakra-ui/react'
import SearchInput from '../../components/general/SearchInput'
import NewProfileButton from '../../components/profiles/NewProfileButton'
import ProfileList from '../../components/profiles/ProfileList'
import { Unit } from '@prisma/client'

interface ProfilesProps {

}

const Profiles: React.FC<ProfilesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [search, setSearch] = React.useState('')
  const [refreshKey, setRefreshKey] = React.useState(0)

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const [entries, setEntries] = React.useState<{ parent_name: string, parent_id: string, units: Unit[] }[]>([])

  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const loadNewEntries = async (args?: { reset: Boolean }) => {
    const newEntries = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/units`
    ).then(res => res.json())
    setCount(newEntries?.totalCount ?? 0)
    
    if (args?.reset) {
      setEntries(newEntries?.data ?? [])
    }

    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    loadNewEntries({ reset: true })
  }, [])

  const [unitFilter, setUnitFilter] = React.useState('')

  return (
    <>
      <NextSeo
        title="User Profiles | URC Management System"
      />
      <VStack spacing={5}>
        <ContentHeader>
          User Profiles
        </ContentHeader>
        <VStack spacing={5} w="full" align="baseline">
          <HStack w="full" spacing={8}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <NewProfileButton onSuccess={refresh} />
          </HStack>
          <Select
            borderColor="brand.blue"
            color="brand.blue"
            placeholder={!loading ? "Unit" : "Loading..."}
            borderRadius={10}
            _focus={{
              boxShadow: "none"
            }}
            value={unitFilter}
            onChange={(e) => { setUnitFilter(e.target.value) }}
            cursor="pointer"
            maxW="200px"
            isDisabled={loading}
          >
            { entries.map((entry) => {
              return entry.units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name} ({entry.parent_name})</option>
              ))
            }) }
          </Select>
          <ProfileList search={search} unitFilter={unitFilter} refreshKey={refreshKey} />
        </VStack>
      </VStack>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${context.req.url}`,
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

export default Profiles
