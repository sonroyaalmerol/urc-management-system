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

interface NewSubmissionButtonProps {
  capsuleUrl: string,
  fullBlownUrl: string,
  budgetUrl: string
}

const NewSubmissionButton: React.FC<NewSubmissionButtonProps> = (props) => {
  const router = useRouter()

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
          href={props.capsuleUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(props.capsuleUrl)
          }}
        >
          Capsule Proposal
        </MenuItem>
        <MenuItem
          as="a"
          href={props.fullBlownUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(props.fullBlownUrl)
          }}
        >
          Full-blown Proposal
        </MenuItem>
        <MenuItem
          as="a"
          href={props.budgetUrl}
          onClick={(e) => {
            e.preventDefault()
            router.push(props.budgetUrl)
          }}
        >
          Budget Proposal
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NewSubmissionButton