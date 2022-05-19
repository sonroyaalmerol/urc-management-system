import React from 'react'
import { Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react'

import { SearchIcon } from '@chakra-ui/icons'

interface SearchInputProps extends InputProps {

}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <InputGroup w="100%" size="lg" >
      <InputLeftElement
        pointerEvents="none"
      >
        <SearchIcon color="brand.blue" />
      </InputLeftElement>
      <Input
        type="text" 
        placeholder="Search" 
        backgroundColor="brand.cardBackground"
        borderColor="white"
        focusBorderColor="white"
        _hover={{
          borderColor: "white"
        }}
        _focus={{
          backgroundColor: "white",
          boxShadow: "0px 5px 20px -10px"
        }}
        borderRadius={10}
        {...props}
      />
    </InputGroup>
  )
}
export default SearchInput
