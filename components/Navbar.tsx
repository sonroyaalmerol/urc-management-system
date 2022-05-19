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
import { useSession, signOut } from 'next-auth/react'
import type { Menu as MenuType } from '../types/menu'

interface NavbarProps extends BoxProps {
  menus: MenuType[]
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { menus } = props
  const router = useRouter()

  const { data: session } = useSession()

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
        bgColor="brand.blue"
        px={4}
        w="100%"
        margin={0}
        boxShadow="0px 1px 10px"
        position="fixed"
        zIndex={1}
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
              blockScrollOnMount={false}
            >
              <DrawerOverlay />
              <DrawerContent paddingY={4} maxW="45vw">
                <DrawerBody paddingX={2}>
                  <VStack>
                    { menus.map((menu, i) => (
                      <Button
                        as="a"
                        key={`top-${menu.url}`}
                        href={menu.url}
                        onClick={(e) => {
                          e.preventDefault()
                          changeMenu(menu)
                        }}
                        borderRadius="20px"
                        paddingY="2rem"
                        fontWeight={currentIndex === i ? 'bold' : 'normal'}
                        bgColor={currentIndex === i ? "brand.blue" : "transparent"}
                        color={currentIndex === i ? "white" : "brand.blue"}
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
                    src={session.user.image}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <NavigationAvatar
                    marginY={4}
                  />
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
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