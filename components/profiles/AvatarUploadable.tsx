
import React from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { 
  Avatar, AvatarProps, Box, Center, Spinner,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form"
import fetchWithFile from '../../lib/client/fetchWithFile'
import { useSession } from 'next-auth/react'

interface AvatarUploadable extends AvatarProps {
  profileId: string
  photoId: string
}


const AvatarUploadable: React.FC<AvatarUploadable> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.profileId
  delete divProps.photoId

  const { register, watch, reset } = useForm<{ files: FileList }>();

  const [submitting, setSubmitting] = React.useState(false)
  const [photoId, setPhotoId] = React.useState(props.photoId)

  const session = useSession()

  const { files } = watch()

  const uploadAvatar = async () => {
    setSubmitting(true)
    const res = await fetchWithFile(`/api/management/profiles/${props.profileId}/avatar`, { avatar: files })

    if (res) {
      setPhotoId(res.data)
    }

    setSubmitting(false)
  }

  React.useEffect(() => {
    if (files?.length > 0) {
      if (files[0].type.includes('image')) {
        uploadAvatar()
      } else {
        console.log('not image')
        reset()
      }
    }
  }, [files])

  return (
    <Box
      position="relative"
      borderRadius="full"
      overflow="hidden"
    >
      <Avatar src={`/api/files/get/${photoId}`} {...divProps} />
      { session.data.profile.id === props.profileId && (
        <>
          <input
            type="file"
            style={{ display: 'none' }}
            id="upload-avatar-file"
            multiple={false}
            {...register('files')}
          />
          <label htmlFor="upload-avatar-file">
            <Box
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              h="full"
              w="full"
              opacity={0}
              transition="opacity 0.1s, background-color 0.1s"
              bgColor="rgba(0, 0, 0, 0.5)"
              cursor="pointer"
              _hover={{
                opacity: 1
              }}
              _active={{
                bgColor: "rgba(0, 0, 0, 0.8)"
              }}
            >
              <Center h="full">
                <EditIcon color="white" fontSize={divProps.size} />
              </Center>
            </Box>
          </label>
          { submitting && (
            <Box
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              h="full"
              w="full"
              bgColor="rgba(0, 0, 0, 0.9)"
            >
              <Center h="full">
                <Spinner color="white" />
              </Center>
            </Box>
          ) }
        </>
      ) }
    </Box>
  )
}

export default AvatarUploadable