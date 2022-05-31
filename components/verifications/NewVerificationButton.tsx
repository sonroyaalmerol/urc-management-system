import React from 'react'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'

import Button from '../general/Button'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'

import { useRouter } from 'next/router'

const NewVerificationButton: React.FC = (props) => {
  const router = useRouter()

  const URLs = {
    externalResearchUrl: '/verifications/external_research',
    journalPublicationUrl: '/verifications/journal_publication',
    bookPublicationUrl: '/verifications/book_publication',
    researchDisseminationUrl: '/verifications/research_dissemination',
    researchPresentationUrl: '/verifications/research_presentation',
    researchEventUrl: '/verifications/research_event'
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<AddIcon/>}
        rightIcon={<ChevronDownIcon />}
      >
        New Request
      </MenuButton>
      <MenuList>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.externalResearchUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.externalResearchUrl}`)
          }}
        >
          External Research
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.journalPublicationUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.journalPublicationUrl}`)
          }}
        >
          Journal Publication
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.bookPublicationUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.bookPublicationUrl}`)
          }}
        >
          Book Publication
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.researchDisseminationUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.researchDisseminationUrl}`)
          }}
        >
          Research Dissemination
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.researchPresentationUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.researchPresentationUrl}`)
          }}
        >
          Research Presentation
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${URLs.researchEventUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${URLs.researchEventUrl}`)
          }}
        >
          Research Event
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NewVerificationButton