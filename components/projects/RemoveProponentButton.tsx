import React from 'react'

import { Icon, useToast } from '@chakra-ui/react'

import { MdGroupOff } from 'react-icons/md'
import { useRouter } from 'next/router'
import useUUID from '../../utils/client/useUUID'
import { memberChecker, roleChecker } from '../../utils/roleChecker'
import { useSession } from 'next-auth/react'
import { ExtendedProfile, ExtendedProject } from '../../types/profile-card'
import { CHANGE_PROJECT_STATUS } from '../../utils/permissions'
import IconButtonWithConfirmation from '../general/IconButtonWithConfirmation'

interface RemoveProponentButtonProps {
  project: Partial<ExtendedProject>
  profile: Partial<ExtendedProfile>
}

const RemoveProponentButton: React.FC<RemoveProponentButtonProps> = (props) => {
  const key = useUUID()

  const [submitting, setSubmitting] = React.useState(false)

  const toast = useToast()
  const router = useRouter()

  const onSubmit = async () => {
    setSubmitting(true)
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/management/projects`, {
      method: 'POST',
      body: JSON.stringify({ email: props.profile.email, mode: 'remove-proponent', id: props.project.id })
    }).then((i) => i.json())

    if (res.success) {
      router.push(`${router.asPath.split('?')[0]}?key=${key}`)
      toast({
        title: 'Success!',
        description: 'Successfully removed proponent!',
        status: 'success'
      })
    } else {
      toast({
        title: 'Error!',
        description: res.error,
        status: 'error'
      })
    }

    setSubmitting(false)
  };

  const session = useSession()

  if (!roleChecker(session.data.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.data.profile, props.project.bridge_profiles)) {
    return <></>
  }
  
  return (
    <>
      <IconButtonWithConfirmation
        aria-label='Remove Proponent'
        onClick={onSubmit}
        isLoading={submitting}
        icon={<Icon as={MdGroupOff} w={6} h={6} />}
        variant='red'
        confirmationMessage={`
          You are about to remove ${props.profile.first_name} ${props.profile.last_name} from ${props.project.title}. Do you want to proceed?
        `}
      />
    </>
  )
}

export default RemoveProponentButton