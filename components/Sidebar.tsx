import React from 'react'
import { VStack, chakra, Box, Center, Container } from '@chakra-ui/react'
import SidebarMenu from './SidebarMenu'
import { useRouter } from 'next/router'
import { motion, useAnimation } from 'framer-motion'

interface Menu {
  name: string,
  url: string
}

interface SidebarProps {
  menus: Menu[] 
}

const Sidebar: React.FC<SidebarProps> = ({ menus }) => {
  const router = useRouter()
  const topControls = useAnimation()
  const bottomControls = useAnimation()

  const [currMenuPos, setCurrMenuPos] = React.useState({
    offsetTop: 0,
    offsetBottom: 0
  })

  const updateCurrentPosition = (data : { offsetTop: number, offsetBottom: number }) => {
    setCurrMenuPos(data)
  }

  React.useEffect(() => {
    topControls.start({
      height: currMenuPos.offsetTop,
      transition: {
        ease: [0.17, 0.67, 0.83, 0.67]
      }
    })

    bottomControls.start({
      height: currMenuPos.offsetBottom,
      transition: {
        ease: [0.17, 0.67, 0.83, 0.67]
      }
    })
  }, [currMenuPos, topControls, bottomControls])

  const [selectedMenu, setSelectedMenu] = React.useMemo(() => {
    return [
      router.pathname,
      router.push
    ]
  }, [router.pathname, router.push])

  const [currentMenu, currentIndex] = React.useMemo(() => {
    const currentIndex = menus.findIndex((menu) => menu.url === selectedMenu)
    const current = menus[currentIndex]

    return [current, currentIndex]
  }, [
    selectedMenu,
    menus
  ])
  
  const changeMenu = (menu: Menu) => {
    setSelectedMenu(menu.url)
  }

  return (
    <VStack maxW='21.25rem' h='100vh' spacing={0} position="relative">
      <Box
        as={motion.div}
        animate={topControls}
        initial={{
          height: '100vh'
        }}
        bgColor="#1A2B75"
        width="100%"
        height="100"
        position="absolute"
        zIndex={0}
        borderBottomRightRadius="2rem"
        top={0}
      />
      <Box
        as={motion.div}
        animate={bottomControls}
        initial={{
          height: '100vh'
        }}
        bgColor="#1A2B75"
        width="100%"
        height="100"
        position="absolute"
        zIndex={0}
        borderTopRightRadius="2rem"
        bottom={0}
      />
      <Container zIndex={1} padding={0}>
        <Center padding="1.5rem" marginBottom='2rem'>
          <chakra.img src="./urc_header.png"></chakra.img>
        </Center>
        
        { menus.map((menu, i) => (
          <SidebarMenu
            key={`top-${menu.url}`}
            selected={currentMenu.url === menu.url}
            onClick={() => changeMenu(menu)}
            borderRadius={0}
            borderTopRightRadius={currentMenu.url === menu.url || currentIndex + 1 === i ? '2rem' : 0}
            borderBottomRightRadius={currentMenu.url === menu.url || currentIndex - 1 === i ? '2rem' : 0}
            updateCurrentPosition={updateCurrentPosition}
          >
            {menu.name}
          </SidebarMenu>
        )) }
      </Container>
    </VStack>
  )
}

export default Sidebar