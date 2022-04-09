import React from 'react'
import { VStack, chakra, Container, Center } from '@chakra-ui/react'
import SidebarMenu from './SidebarMenu'
import { useRouter } from 'next/router'

interface SidebarProps {
  menus: {
    name: string,
    url: string
  }[] 
}

const Sidebar: React.FC<SidebarProps> = ({ menus }) => {
  const router = useRouter()

  const [selectedMenu, setSelectedMenu] = React.useMemo(() => {
    return [
      router.pathname,
      router.push
    ]
  }, [router.pathname, router.push])

  const [topMenus, bottomMenus, currentMenu] = React.useMemo(() => {
    const current = menus.find((menu) => menu.url === selectedMenu)
    const bottom = [...menus].filter((menu) => menu.url !== selectedMenu)
    const top = bottom.splice(0, menus.findIndex((menu) => menu.url === selectedMenu)).filter((menu) => menu.url !== selectedMenu)
    return [top, bottom, current]
  }, [selectedMenu, menus])
  const changeMenu = (menu) => {
    setSelectedMenu(menu.url)
  }

  return (
    <VStack maxW='21.25rem' h='100vh' spacing={0}>
      <Container w='100%' backgroundColor='brand.blue' borderBottomRightRadius={currentMenu ? '2rem' : '0'} padding='0'>
        <Center padding="1.5rem" marginBottom='2rem'>
          <chakra.img src="./urc_header.png"></chakra.img>
        </Center>
        { topMenus.map((menu, i) => (
          <SidebarMenu key={`top-${menu.url}`} onClick={() => changeMenu(menu)} borderRadius='0' borderBottomRightRadius={i === topMenus.length - 1 && currentMenu ? '2rem' : '0'}>{menu.name}</SidebarMenu>
        )) }
      </Container>
      { currentMenu ? (
        <SidebarMenu onClick={() => changeMenu(currentMenu)} selected key={currentMenu.url} borderRadius='0' borderTopRightRadius='2rem' borderBottomRightRadius='2rem'>{currentMenu.name}</SidebarMenu>
      ) : null }
      <Container w='100%' backgroundColor='brand.blue' h="100%" borderTopRightRadius={currentMenu ? '2rem' : '0'} padding='0'>
        { bottomMenus.map((menu, i) => (
          <SidebarMenu onClick={() => changeMenu(menu)} key={`bottom-${menu.url}`} borderRadius='0' borderTopRightRadius={i === 0 && currentMenu ? '2rem' : '0'}>{menu.name}</SidebarMenu>
        )) }
      </Container>
    </VStack>
  )
}

export default Sidebar