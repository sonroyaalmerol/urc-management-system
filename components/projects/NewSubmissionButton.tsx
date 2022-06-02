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
import { useSession } from 'next-auth/react'
import { memberChecker, roleChecker } from '../../utils/roleChecker'
import { ExtendedProject } from '../../types/profile-card'

interface NewSubmissionButtonProps {
  project: Partial<ExtendedProject>
}

const NewSubmissionButton: React.FC<NewSubmissionButtonProps> = (props) => {
  const router = useRouter()
  
  const session = useSession()

  const capsuleUrl = `/projects/${props.project.slug}/submissions/new/capsule`
  const fullBlownUrl = `/projects/${props.project.slug}/submissions/new/full`
  const budgetUrl = `/projects/${props.project.slug}/submissions/new/budget`

  if (!memberChecker(session.data.profile, props.project.bridge_profiles)) {
    return <></>
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<AddIcon/>}
        rightIcon={<ChevronDownIcon />}
      >
        New Submission
      </MenuButton>
      <MenuList>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${capsuleUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${capsuleUrl}`)
          }}
        >
          Capsule Proposal
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${fullBlownUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${fullBlownUrl}`)
          }}
        >
          Full-blown Proposal
        </MenuItem>
        <MenuItem
          as="a"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${budgetUrl}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(`${budgetUrl}`)
          }}
        >
          Budget Proposal
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NewSubmissionButton