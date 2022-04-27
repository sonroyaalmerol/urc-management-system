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
  Center,
  BoxProps,
  IconButton,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router'
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
      <Box bgColor="#1A2B75" px={4} w="100%" margin={0} {...divProps}>
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
                <DrawerBody paddingX={0}>
                  <VStack>
                    { menus.map((menu, i) => (
                      <Button
                        key={`top-${menu.url}`}
                        onClick={() => changeMenu(menu)}
                        borderRadius={0}
                        bgColor="transparent"
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
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
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