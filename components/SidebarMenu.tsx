import React, { LegacyRef } from 'react'
import { Button, ButtonProps, Center } from '@chakra-ui/react'

interface SidebarMenuProps extends ButtonProps {
  selected?: boolean,
  ref?: LegacyRef<HTMLButtonElement>,
  href: string,
  updateCurrentPosition?: (data: { offsetTop: number, offsetBottom: number }) => void
}

const useSize = (target : React.RefObject<any>) => {
  const [size, setSize] = React.useState<{ offsetTop: number, offsetBottom: number } | null>()

  React.useEffect(() => {
    const polling = setInterval(() => {
      const boundingClientRect = target.current?.getBoundingClientRect()
      const currentPosition = {
        offsetTop: boundingClientRect?.top ?? 0,
        offsetBottom: window.innerHeight - (boundingClientRect?.bottom ?? 0 + boundingClientRect?.height ?? 0)
      }
      if (size !== currentPosition) {
        setSize(currentPosition)
      }
    }, 250)

    return () => {
      clearInterval(polling)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return size
}

const SidebarMenu: React.FC<SidebarMenuProps> = (props) => {
  const { selected, updateCurrentPosition } = props
  const target = React.useRef(null)
  const size = useSize(target)

  const divProps = Object.assign({}, props)
  delete divProps.onClick
  delete divProps.updateCurrentPosition

  React.useEffect(() => {
    if (updateCurrentPosition && selected && size) {
      updateCurrentPosition(size)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, selected])

  return (
    <Button
      as="a"
      w='100%'
      backgroundColor='transparent'
      color={props.selected ? 'brand.blue' : 'white'}
      fontWeight={props.selected ? 'semibold' : 'normal' }
      _hover={{
        color: "brand.blue",
        backgroundColor: "brand.cardBackground"
      }}
      h="3.2rem"
      ref={target}
      onClick={(e) => {
        e.preventDefault()
        props.onClick(e)
      }}
      {...divProps}
    >
      <Center h="3.2rem">
        {props.children}
      </Center>
    </Button>
  )
}

export default SidebarMenu