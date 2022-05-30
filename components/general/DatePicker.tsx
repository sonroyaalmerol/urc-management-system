import React from 'react'

import { SingleDatepicker, SingleDatepickerProps } from 'chakra-dayzed-datepicker'

interface DatePickerProps extends Partial<SingleDatepickerProps> {
  onChange?: (any) => any
  value?: Date
}

const monthNamesShort = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const weekdayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


const DatePicker: React.FC<DatePickerProps> = (props) => {
  const divProps = Object.assign({}, props)
  delete divProps.onChange

  const change = (date: Date) => {
    props.onChange(date)
  }

  return (
    <SingleDatepicker 
      configs={{
        dateFormat: 'MMMM dd, yyyy',
        monthNames: monthNamesShort,
        dayNames: weekdayNamesShort,
      }}
      onDateChange={change}
      date={props.value}
      {...divProps}
    />
  )
}

export default DatePicker