import React from 'react'

import { Tag, TagProps } from '@chakra-ui/react'

interface ApprovalTagProps extends TagProps {
  status: boolean
}
 
const VerifiedTag: React.FC<ApprovalTagProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.status

  const generator = React.useMemo(() => {
    switch (props.status) {
      case true:
        return {color: "brand.blue", text: "Verified"}
      case false:
        return {color: "brand.red", text: "Not Verified"}
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

export default VerifiedTag
