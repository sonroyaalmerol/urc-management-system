import React from 'react'

import { Tag, TagProps } from '@chakra-ui/react'

interface ApprovalTagProps extends TagProps {
  status?: boolean | null
}
 
const ApprovalTag: React.FC<ApprovalTagProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.status

  const generator = React.useMemo(() => {
    switch (props.status) {
      case null:
      case undefined:
        return {color: "brand.lightBlue", text: "Not yet processed"}
      case true:
        return {color: "brand.blue", text: "Approved"}
      case false:
        return {color: "brand.red", text: "Not Approved"}
    }
  }, [props.status])

  return (
    <Tag
      bgColor={generator.color}
      textColor="white"
      borderRadius="20px"
      fontSize="xs"
      fontWeight="bold"
      paddingX="0.8rem"
      {...divProps}
    >
      {generator.text}
    </Tag>
  )
}

export default ApprovalTag
