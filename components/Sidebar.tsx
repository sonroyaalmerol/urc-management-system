import React from 'react'
import { VStack, chakra, Box, Center, Container, StackProps } from '@chakra-ui/react'
import SidebarMenu from './SidebarMenu'
import { useRouter } from 'next/router'
import { motion, useAnimation } from 'framer-motion'
import type { Menu } from '../types/menu'
import NavigationAvatar from './NavigationAvatar'

interface SidebarProps extends StackProps {
  menus: Menu[]
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { menus } = props
  const router = useRouter()
  const topControls = useAnimation()
  const bottomControls = useAnimation()

  const divProps = Object.assign({}, props)
  delete divProps.menus

  const [currMenuPos, setCurrMenuPos] = React.useState({
    offsetTop: 0,
    offsetBottom: 0
  })

  const updateCurrentPosition = (data : { offsetTop: number, offsetBottom: number }) => {
    setCurrMenuPos(data)
  }

  React.useEffect(() => {
    if (currMenuPos.offsetBottom !== 0 && currMenuPos.offsetTop !== 0) {
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
    }
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
    <VStack
      maxW='21.25rem'
      h='100vh'
      spacing={0}
      position="relative"
      {...divProps}
    >
      <Box
        as={motion.div}
        animate={topControls}
        initial={{
          height: '100vh'
        }}
        bgColor="brand.blue"
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
        bgColor="brand.blue"
        width="100%"
        height="100"
        position="absolute"
        zIndex={0}
        borderTopRightRadius="2rem"
        bottom={0}
      />
      <Container zIndex={5} padding={0} w="300px">
        <Center padding="1.5rem" marginBottom='2rem'>
          <VStack spacing={8} color="white">
            <chakra.img zIndex={5} src="./urc_header.png"></chakra.img>
            <NavigationAvatar avatarSize="small" />
          </VStack>
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