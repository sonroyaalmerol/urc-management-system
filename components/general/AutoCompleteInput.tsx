import React from 'react'
import { Center, Spinner } from '@chakra-ui/react'

import { UseFormWatch, UseFormSetValue } from "react-hook-form"

import {
  AutoComplete,
  AutoCompleteInput as ACInput,
  AutoCompleteItem,
  AutoCompleteList
} from "@choc-ui/chakra-autocomplete"
import { useDebounce } from 'use-debounce'

interface ExtendedAutoCompleteInputProps {
  api: string
  name?: string
  primaryDisplayName?: string
  secondaryDisplayName?: string
  formSetValue?: UseFormSetValue<any>
  watchExists?: (exists: boolean) => any
}

const AutoCompleteInput: React.FC<ExtendedAutoCompleteInputProps> = (props) => {
  const [loadingTitles, setLoadingTitles] = React.useState(true)

  const [entries, setEntries] = React.useState<any[]>([])

  const [search, setSearch] = React.useState('')
  const [deferredSearch] = useDebounce(search, 500)

  const [exists, setExists] = React.useState(false)

  React.useEffect(() => {
    if ('watchExists' in props) {
      props.watchExists(exists)
    }
  }, [exists])

  const loadNewEntries = async () => {
    const newEntries = await fetch(
      `${props.api}?${search?.length > 0 ? `&query=${search}` : ''}`
    ).then(res => res.json())

    setEntries(newEntries?.data ?? [])
    setLoadingTitles(false)
  }

  React.useEffect(() => {
    setLoadingTitles(true)
    if (deferredSearch === search) {
      setLoadingTitles(false)
    }
  }, [search])

  React.useEffect(() => {
    loadNewEntries()
  }, [deferredSearch])

  const displayGenerator = (primary, secondary, name) => {
    let display = ''
    if (primary) {
      display = `${primary}`
    }
    if (secondary) {
      display = `${display} ${secondary}`
    }

    if (name && (primary || secondary)) {
      display = `${display} <${name}>`
    } else {
      display = name
    }

    return display
  }

  return (
    <AutoComplete 
      openOnFocus
      disableFilter
      onChange={(vals) => {
        if ('formSetValue' in props && 'name' in props) {
          props.formSetValue(props.name, vals)
        }
        setSearch(vals)
        setExists(true)
      }}
      value={search}
    >
      <ACInput
        autoComplete='off'
        onChange={(e) => {
          if ('formSetValue' in props && 'name' in props) {
            props.formSetValue(props.name, e.target.value)
          }
          setSearch(e.target.value)
          setExists(false)
        }}
        onBlur={(e) => {
          if (!exists && e.target.value !== '' && !('watchExists' in props)) {
            e.target.value = ''
            if ('formSetValue' in props && 'name' in props) {
              props.formSetValue(props.name, e.target.value)
            }
          }
        }}
      />
      <AutoCompleteList>
        {!loadingTitles ? entries.map((entry) => (
          <AutoCompleteItem
            key={entry.id}
            value={entry[props.name ?? 'id']}
          >
            {displayGenerator(entry[props.primaryDisplayName], entry[props.secondaryDisplayName], entry[props.name ?? 'id'])}
          </AutoCompleteItem>
        )) : (
          <Center marginTop="2rem">
            <Spinner color="brand.blue" />
          </Center>
        )}
      </AutoCompleteList>
    </AutoComplete>
  )
}

export default AutoCompleteInput