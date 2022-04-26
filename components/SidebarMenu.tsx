import React, { LegacyRef } from 'react'
import { Button, ButtonProps, Center } from '@chakra-ui/react'
import useResizeObserver from '@react-hook/resize-observer'

interface SidebarMenuProps extends ButtonProps {
  selected?: boolean,
  ref?: LegacyRef<HTMLButtonElement>,
  updateCurrentPosition?: (data: { offsetTop: number, offsetBottom: number }) => void
}

const useSize = (target : React.RefObject<any>) => {
  const [size, setSize] = React.useState<DOMRectReadOnly | null>()

  React.useEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

const SidebarMenu: React.FC<SidebarMenuProps> = (props) => {
  const { selected, updateCurrentPosition } = props
  const target = React.useRef(null)
  const size = useSize(target)

  const divProps = Object.assign({}, props)
  delete divProps.updateCurrentPosition

  React.useEffect(() => {
    if (updateCurrentPosition && selected) {
      const currentPosition = {
        offsetTop: target.current.offsetTop,
        offsetBottom: window.innerHeight - (target.current.offsetTop + target.current.offsetHeight)
      }
      updateCurrentPosition(currentPosition)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, selected])

  return (
    <Button 
      w='100%'
      backgroundColor='transparent'
      color={props.selected ? 'brand.blue' : 'white'}
      h="4.375rem"
      ref={target}
      {...divProps}
    >
      <Center h="4.375rem">
        {props.children}
      </Center>
    </Button>
  )
}

export default SidebarMenu