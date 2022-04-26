import React, { LegacyRef } from 'react'
import { Button, ButtonProps, Center } from '@chakra-ui/react'
import useResizeObserver from '@react-hook/resize-observer'
import useIntersectionObserver from '@react-hook/intersection-observer'
interface SidebarMenuProps extends ButtonProps {
  selected?: boolean,
  ref?: LegacyRef<HTMLButtonElement>,
  updateCurrentPosition?: (data: { offsetTop: number, offsetBottom: number }) => void
}

const useSize = (target : React.RefObject<any>) => {
  const [size, setSize] = React.useState<{ offsetTop: number, offsetBottom: number } | null>()

  const { boundingClientRect } = useIntersectionObserver(target)

  const updatePosition = (offsetTop: number, offsetBottom: number) => {
    const currentPosition = {
      offsetTop: offsetTop,
      offsetBottom: offsetBottom
    }

    setSize(currentPosition)
  }

  React.useEffect(() => {
    console.log('intersection')
    updatePosition(
      boundingClientRect?.top ?? 0,
      window.innerHeight - (boundingClientRect?.bottom ?? 0 + boundingClientRect?.height ?? 0),
    )
  }, [boundingClientRect?.top, boundingClientRect?.bottom, boundingClientRect?.height])
  
  useResizeObserver(target, (entry) => {
    console.log('resize')
    updatePosition(
      entry.target?.getBoundingClientRect()?.top ?? 0,
      window.innerHeight - (entry.target?.getBoundingClientRect()?.bottom ?? 0 + entry.target?.getBoundingClientRect()?.height ?? 0),
    )
  })

  return size
}

const SidebarMenu: React.FC<SidebarMenuProps> = (props) => {
  const { selected, updateCurrentPosition } = props
  const target = React.useRef(null)
  const size = useSize(target)

  const divProps = Object.assign({}, props)
  delete divProps.updateCurrentPosition

  React.useEffect(() => {
    if (updateCurrentPosition && selected && size) {
      updateCurrentPosition(size)
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