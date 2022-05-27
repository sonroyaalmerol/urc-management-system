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
    externalResearchUrl: '',
    journalPublicationUrl: '',
    bookPublicationUrl: '',
    researchDisseminationUrl: '',
    researchPresentationUrl: '',
    researchEventAttendanceUrl: ''
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<AddIcon/>}
        rightIcon={<ChevronDownIcon />}
      >
        New Verification
      </MenuButton>
      <MenuList>
        <MenuItem
          as="a"
          href={URLs.externalResearchUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.externalResearchUrl)
          }}
        >
          External Research
        </MenuItem>
        <MenuItem
          as="a"
          href={URLs.journalPublicationUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.journalPublicationUrl)
          }}
        >
          Journal Publication
        </MenuItem>
        <MenuItem
          as="a"
          href={URLs.bookPublicationUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.bookPublicationUrl)
          }}
        >
          Book Publication
        </MenuItem>
        <MenuItem
          as="a"
          href={URLs.researchDisseminationUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.researchDisseminationUrl)
          }}
        >
          Research Dissemination
        </MenuItem>
        <MenuItem
          as="a"
          href={URLs.researchPresentationUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.researchPresentationUrl)
          }}
        >
          Research Presentation
        </MenuItem>
        <MenuItem
          as="a"
          href={URLs.researchEventAttendanceUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(URLs.researchEventAttendanceUrl)
          }}
        >
          Research Event Attendance
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NewVerificationButton