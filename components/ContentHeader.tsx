import React, { ReactNode } from 'react'
import { Box, Heading, chakra } from '@chakra-ui/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { useRouter } from 'next/router'

interface DashboardContentHeaderProps {
  children?: ReactNode
}

const DashboardContentHeader: React.FC<DashboardContentHeaderProps> = (props) => {
  const router = useRouter()

  const breadcrumbs = React.useMemo<{ href: string, text: string }[]>(() => {
    const titleize = (slug: string) => {
      var words = slug.split("-");
      return words.map(function(word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
      }).join(' ')
    }
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0]

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
                                                 .filter(v => v.length > 0)

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/")
      // The title will just be the route string for now
      let title = titleize(subpath)

      if (title.length > 50) {
        title = title.slice(0, 47) + "..."
      }

      return { href, text: title }
    })

    crumblist.pop()
    // Add in a default "Home" crumb for the top-level
    if (crumblist.length < 2) {
      return [{ href: '/', text: 'AdDU URC' }, ...crumblist]
    }

    return [...crumblist];
  }, [router.pathname])

  return (
    <chakra.main w="full">
      <Box w="full" bgImg='url(/header.png)' bgPos="right" bgSize="cover" borderRadius='10px'>
        <Box w="full" h="full" bgColor='rgba(0,0,0,0.5)' borderRadius='10px'>
          <Box w="full" h="full" color='white' padding='2rem'>
            <Breadcrumb
              spacing='8px'
              separator={<ChevronRightIcon color='brand.cardBackground' />}
              marginBottom="0.5rem"
            >
              {breadcrumbs.map((crumb, idx) => (
                <BreadcrumbItem key={`crumb-${idx}`}>
                  <BreadcrumbLink
                    href={crumb.href}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(crumb.href)
                    }}
                  >{crumb.text}</BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
            <Heading size='md'>
              {props.children}
            </Heading>
          </Box>
        </Box>
      </Box>
    </chakra.main>
  )
}

export default DashboardContentHeader
