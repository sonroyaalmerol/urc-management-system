import React from 'react'
import {
  Box,
  Flex,
  Avatar,
  chakra,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  BoxProps,
  IconButton,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  VStack,
  Text
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import NavigationAvatar from './NavigationAvatar'
import type { Menu as MenuType } from '../types/menu.type'

interface NavbarProps extends BoxProps {
  menus: MenuType[]
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { menus } = props
  const router = useRouter()

  const divProps = Object.assign({}, props)
  delete divProps.menus

  const [selectedMenu, setSelectedMenu] = React.useMemo(() => {
    return [
      router.pathname,
      router.push
    ]
  }, [router.pathname, router.push])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [currentMenu, currentIndex] = React.useMemo(() => {
    const currentIndex = menus.findIndex((menu) => menu.url === selectedMenu)
    const current = menus[currentIndex]

    return [current, currentIndex]
  }, [
    selectedMenu,
    menus
  ])
  
  const changeMenu = (menu: MenuType) => {
    setSelectedMenu(menu.url)
    onClose()
  }

  return (
    <>
      <Box
        bgColor="#1A2B75"
        px={4}
        w="100%"
        margin={0}
        boxShadow="0px 1px 10px"
        position="fixed"
        {...divProps}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={4}>
            <IconButton
              minW={0}
              variant="link"
              aria-label='Menus'
              color="white"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
            <Drawer
              placement="left"
              onClose={onClose}
              isOpen={isOpen}
            >
              <DrawerOverlay />
              <DrawerContent paddingY={4} maxW="45vw">
                <DrawerBody paddingX={2}>
                  <VStack>
                    { menus.map((menu, i) => (
                      <Button
                        key={`top-${menu.url}`}
                        onClick={() => changeMenu(menu)}
                        borderRadius="20px"
                        paddingY="2rem"
                        bgColor={currentIndex === i ? "#1A2B75" : "transparent"}
                        color={currentIndex === i ? "white" : "#1A2B75"}
                        width="100%"
                      >
                        {menu.name}
                      </Button>
                    )) }
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <chakra.img zIndex={5} src="./urc_header.png" maxWidth="50vw"></chakra.img>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://bit.ly/sage-adebayo'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <NavigationAvatar
                    name='Segun Adebayo'
                    imageUrl='https://bit.ly/sage-adebayo'
                    email='sadebayo@addu.edu.ph'
                  />
                  <br />
                  <MenuDivider />
                  <MenuItem>Log Out</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Navbar