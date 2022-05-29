import React from 'react'

import { Tag, TagProps } from '@chakra-ui/react'
import type { ProjectStatus } from '@prisma/client'

interface ProjectStatusTagProps extends TagProps {
  projectStatus: ProjectStatus
}
 
const ProjectStatusTag: React.FC<ProjectStatusTagProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.projectStatus

  const generator = React.useMemo(() => {
    switch (props.projectStatus.id) {
      case 'not_implemented':
      case 'on_going':
        return "brand.lightBlue"
      case 'finished':
        return "brand.blue"
      case 'cancelled':
        return "brand.red"
    }
  }, [props.projectStatus.id])

  return (
    <Tag
      bgColor={generator}
      textColor="white"
      borderRadius="20px"
      fontSize="xs"
      fontWeight="bold"
      paddingX="0.8rem"
      {...divProps}
    >
      {props.projectStatus.comment}
    </Tag>
  )
}

export default ProjectStatusTag
