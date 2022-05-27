import React from 'react'

import { v4 as uuidv4 } from 'uuid'

const useUUID = () => {
  const uuid: string = React.useMemo(() => {
    return uuidv4()
  }, [])

  return uuid
}

export default useUUID