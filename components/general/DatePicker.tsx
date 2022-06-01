import { Input, InputProps } from '@chakra-ui/react'
import { format } from 'date-fns'
import React from 'react'

interface DatePickerProps extends Omit<InputProps, 'value'> {
  value?: Date,
  withTime?: boolean
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.value

  const value = React.useMemo(() => {
    if (!props.value) {
      return ''
    }

    if (props.withTime) {
      return format(new Date(props.value), "yyyy-MM-dd'T'HH:mm")
    }

    return format(new Date(props.value), "yyyy-MM-dd")
  }, [props.value])

  return (
    <Input
      type={props.withTime ? "datetime-local" : "date"}
      {...divProps}
      pattern={props.withTime ? "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}" : "[0-9]{4}-[0-9]{2}-[0-9]{2}"}
      value={value}
    />
  )
}

export default DatePicker