import rawParse, { HTMLReactParserOptions, Element, domToReact, attributesToProps, Text } from 'html-react-parser'
import { 
  Text as ChakraText, 
  UnorderedList,
  ListItem,
  OrderedList
} from '@chakra-ui/react'

interface ParseOptions {
  disableImages?: boolean,
  textOnly?: boolean
}

const parseOptions: (options?: ParseOptions) => HTMLReactParserOptions = (options) => {
  return ({
    replace: _domNode => {
      if ((_domNode as Element).type === 'tag') {
        const domNode = _domNode as Element
        const props = attributesToProps(domNode.attribs)

        if (options?.textOnly) {
          return <>{domToReact(domNode.children, parseOptions(options))}</>
        }
  
        if (options?.disableImages) {
          if (domNode.name === 'img') {
            return <></>
          }
        }
  
        if (domNode.name === 'p') {
          return (
            <ChakraText marginBottom="1rem" {...props}>{domToReact(domNode.children, parseOptions(options))}</ChakraText>
          )
        }
  
        if (domNode.name === 'ul') {
          return (
            <UnorderedList marginBottom="1rem" {...props}>{domToReact(domNode.children, parseOptions(options))}</UnorderedList>
          )
        }
  
        if (domNode.name === 'li') {
          return (
            <ListItem {...props}>{domToReact(domNode.children, parseOptions(options))}</ListItem>
          )
        }
  
        if (domNode.name === 'ol') {
          return (
            <OrderedList marginBottom="1rem" {...props}>{domToReact(domNode.children, parseOptions(options))}</OrderedList>
          )
        }
  
        if (domNode.name === 'hr') {
          return <></>
        }
  
        if (domNode.attribs.class === 'wp-block-file') {
          return <></>
        }
      } else {
        return <>{(_domNode as Text).nodeValue.replace(/\s+/g, ' ')}</>
      }
    }
  })
}

const parse = (html: string, options?: ParseOptions) => rawParse(html, parseOptions(options))

export default parse