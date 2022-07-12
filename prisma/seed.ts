/* eslint-disable @next/next/no-assign-module-variable */
import { FileUpload, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import slugify from 'slugify'

import https from 'https'

// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)');

import type fetchType from 'node-fetch'
const fetch: typeof fetchType = async (...args:any[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
}

import centers from './data/centers'
import council from './data/council'
import { scrapeNews, scrapePresentations, scrapePublications, scrapeResearches } from './scraper'
import { uploadFile as upload } from '../utils/server/file'

import parse from 'date-fns/parse'

prisma.$use(async (params, next) => {
  // Manipulate params here
  const manipulatedParams = Object.assign({}, params)
  const AUDIT_ACTIONS = [
    'create',
    'createMany',
    'delete',
    'deleteMany',
    'update',
    'updateMany',
    'upsert'
  ]
  if (AUDIT_ACTIONS.includes(params.action) && params.model !== 'Audit') {
    await prisma.audit.create({
      data: {
        table_name: params.model,
        action: params.action,
        args: JSON.stringify(params.args)
      }
    })

    // add slug
    const SLUGIFY_MODELS = [
      'ExternalResearch',
      'InstituteNews',
      'ResearchPresentation',
      'ResearchDissemination',
      'JournalPublication',
      'BookPublication',
      'Project'
    ]
    if (SLUGIFY_MODELS.includes(params.model)) {
      if (params.action === 'create') {
        if (!params.args.data.slug && params.args.data.title) {
          const slug = slugify(`${params.args.data.title}`, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
          manipulatedParams.args.data.slug = slug
        }
      } else if (params.action === 'upsert') {
        if (!params.args.create.slug && params.args.create.title) {
          const slug = slugify(`${params.args.create.title}`, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
          manipulatedParams.args.create.slug = slug
        }
      }
    }

  }
  const result = await next(manipulatedParams)
  // See results here
  return result
})

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


const uploadFile = async (fileUrl) => {
  const response = await fetch(fileUrl.replace('http:', 'https:'), {
    method: 'GET',
    agent: httpsAgent,
    redirect: 'follow'
  })

  const urlParts = fileUrl.split('/')

  const filename = urlParts[urlParts.length - 1]
  const mimeType = response.headers.get('content-type')

  const buff = []
  const getBuffer = () => new Promise<Buffer>((resolve, reject) => {
    response.body.on('data', (chunk) => {
      buff.push(chunk)
    })

    response.body.on('end', () => {
      resolve(Buffer.concat(buff))
    })

    response.body.on('error', () => {
      reject()
    })
  })

  const buffer = await getBuffer()
  
  const res = await upload({
    body: buffer,
    mimeType,
    origName: filename,
    publicAccess: true
  }, null)

  return res as FileUpload
}

async function main() {
  let profile
  try {
    [ profile ] = await prisma.$transaction([
      prisma.profile.upsert({
        where: {
          email: 'sonraalmerol@addu.edu.ph'
        },
        update: {},
        create: {
          email: 'sonraalmerol@addu.edu.ph',
          first_name: 'Son Roy',
          middle_initial: 'A.',
          last_name: 'Almerol',
          honorific: 'Mr.',
          roles: {
            connectOrCreate: {
              where: {
                id: 'urc_staff'
              },
              create: {
                id: 'urc_staff',
                comment: 'URC Staff'
              }
            }
          }
        }
      }),
      prisma.projectStatus.upsert({
        where: { id: 'not_implemented' },
        update: {},
        create: {
          id: 'not_implemented',
          comment: 'Not implemented'
        }
      }),
      prisma.projectStatus.upsert({
        where: { id: 'on_going' },
        update: {},
        create: {
          id: 'on_going',
          comment: 'On-going'
        }
      }),
      prisma.projectStatus.upsert({
        where: { id: 'finished' },
        update: {},
        create: {
          id: 'finished',
          comment: 'Finished'
        }
      }),
      prisma.projectStatus.upsert({
        where: { id: 'cancelled' },
        update: {},
        create: {
          id: 'cancelled',
          comment: 'Cancelled'
        }
      }),
      prisma.institute.upsert({
        where: { name: 'The Council' },
        update: {},
        create: {
          name: 'The Council',
          short_name: 'URC'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'urc_chairperson' },
        update: {},
        create: {
          id: 'urc_chairperson',
          comment: 'URC Chairperson'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'urc_executive_secretary' },
        update: {},
        create: {
          id: 'urc_executive_secretary',
          comment: 'URC Executive Secretary'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'urc_staff' },
        update: {},
        create: {
          id: 'urc_staff',
          comment: 'URC Staff'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'urc_board_member' },
        update: {},
        create: {
          id: 'urc_board_member',
          comment: 'URC Board Member'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'researcher' },
        update: {},
        create: {
          id: 'researcher',
          comment: 'Researcher'
        }
      }),
      prisma.userRole.upsert({
        where: { id: 'admin' },
        update: {},
        create: {
          id: 'admin',
          comment: 'Administrator'
        }
      }),
    ])

  } catch (err) {
    console.log(err)
  }

  let researches = []
  let presentations = []
  let publications = []
  let news = []

  try {
    /* 
    [researches, presentations, publications, news] = await Promise.all([
      scrapeResearches(),
      scrapePresentations(),
      scrapePublications(),
      scrapeNews()
    ])

    */

    [news] = await Promise.all([
      scrapeNews()
    ])
  } catch (err) {
    console.log(err)
  }
  
  /*
  const extractUnits = (unitsString) => {
    const rawUnits = unitsString.split(',')
    const doneUnits = []

    return rawUnits?.filter((unitDetail) => {
      const unitTrimmed = unitDetail.trim()
      if (unitTrimmed.split('-').length > 1) {
        if (!doneUnits.includes(unitDetail.trim().split('-')[1].trim())) {
          doneUnits.push(unitDetail.trim().split('-')[1].trim())
          return true
        }
        return false
      } else {
        if (!doneUnits.includes(unitDetail.trim().split('-')[0].trim())) {
          doneUnits.push(unitDetail.trim().split('-')[0].trim())
          return true
        }
        return false
      }
    }).map((unitDetail) => {
      const unitTrimmed = unitDetail.trim()
      if (unitTrimmed.split('-').length > 1) {
        return {
          where: {
            name: unitDetail.trim().split('-')[1].trim()
          },
          create: {
            name: unitDetail.trim().split('-')[1].trim(),
            parent_unit: {
              connectOrCreate: {
                where: {
                  name: unitDetail.trim().split('-')[0].trim()
                },
                create:{ 
                  name: unitDetail.trim().split('-')[0].trim()
                }
              }
            }
          }
        }
      }
      return {
        where: {
          name: unitDetail.trim().split('-')[0].trim()
        },
        create: {
          name: unitDetail.trim().split('-')[0].trim()
        }
      }
    })
  }
  for (const research of researches) {
    if (research.fundSource === 'AdDU-URC') {
      try {
        const project = await prisma.project.upsert({
          where: { title: research.name },
          update: {},
          create: {
            title: research.name,
            cycle: research.cycle,
            budget: research.budget,
            completed_at: research.dateCompleted,
            abstract: research.abstract,
            keywords: research.keywords,
            units: {
              connectOrCreate: extractUnits(research.unit)
            },
            project_status_id: 'finished'
          },
        })
      } catch (err) {
        console.log(research.name)
        console.log(extractUnits(research.unit))
        console.log(err)
      }
    } else {
      try {
        await prisma.externalResearch.upsert({
          where: { title: research.name },
          update: {},
          create: {
            title: research.name,
            organization: research.fundSource,
            cycle: research.cycle,
            budget: research.budget,
            verified: true,
            project_status_id: 'finished'
          },
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  for (const presentation of presentations) {
    try {
      await prisma.researchPresentation.upsert({
        where: { title: presentation.title },
        update: {},
        create: {
          is_external_research: presentation.fundSource !== 'AdDU-URC',
          title: presentation.title,
          location: presentation.place,
          units: {
            connectOrCreate: extractUnits(presentation.unit)
          },
          event_date: presentation.date,
          verified: true,
          presentors: presentation.presentor.split(',').map((i) => i.trim()).filter((i) => i),
          conference: presentation.conference,
          budget: presentation.budget
        },
      })
    } catch (err) {
      console.log(presentation.title)
      console.log(err)
    }
  }

  for (const publication of publications) {
    if (publication.type === 'journal') {
      try {
        await prisma.journalPublication.upsert({
          where: { title: publication.title },
          update: {},
          create: {
            title: publication.title,
            authors: publication.authors.split(',').map((i) => i.trim()).filter((i) => i),
            issn: publication.issn,
            journal: publication.journal,
            url: publication.link,
            is_indexed: publication.indexed === 'Yes',
            verified: true,
            units: {
              connectOrCreate: extractUnits(publication.unit)
            },
          },
        })
      } catch (err) {
        console.log(publication.title)
        console.log(err)
      }
    } else {
      try {
        await prisma.bookPublication.upsert({
          where: { title: publication.title },
          update: {},
          create: {
            title: publication.title,
            authors: publication.authors.split(',').map((i) => i.trim()).filter((i) => i),
            publisher: publication.publisher,
            isbn: publication.isbn,
            verified: true,
            units: {
              connectOrCreate: extractUnits(publication.unit)
            },
          },
        })
      } catch (err) {
        console.log(publication.title)
        console.log(extractUnits(publication.unit))
        console.log(err)
      }
    }
  }
  
  //*/

  for (const article of news) {
    try {
      const uploads = []
      for (const fileUrlIndex in article.files) {
        const fileUrl = article.files[fileUrlIndex]
        const res = await uploadFile(fileUrl)
        uploads.push(res)
      }

      const bridgeConstructor = uploads.map((upload) => (
        {
          id: upload.id
        }
      ))

      await prisma.instituteNews.upsert({
        where: { title: article.title },
        update: {},
        create: {
          title: article.title,
          content: article.description,
          uploads: {
            connect: bridgeConstructor
          },
          verified: true,
          institute: {
            connect: {
              short_name: 'URC'
            }
          },
          created_at: new Date(article.date)
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  for (const member of council) {
    try {
      const res = await uploadFile(member.image)

      const dates = member.duration.split("-").map((date) => date.trim())

      const start_date = dates[0].split(" ").length > 1 ? (
        parse(dates[0], 'MMMM yyyy', new Date())
      ) : (
        dates[0].toLowerCase() === "present" ? null : parse(dates[0], 'yyyy', new Date())
      );

      const end_date = dates[1].split(" ").length > 1 ? (
        parse(dates[1], 'MMMM yyyy', new Date())
      ) : (
        dates[1].toLowerCase() === "present" ? null : parse(dates[1], 'yyyy', new Date())
      );

      await prisma.profile.upsert({
        where: { email: member.email },
        update: {},
        create: {
          first_name: member.first_name,
          middle_initial: member.middle_initial,
          last_name: member.last_name,
          honorific: member.honorific,
          titles: member.titles,
          email: member.email,
          bridge_institutes: {
            create: {
              institute: {
                connectOrCreate: {
                  where: {
                    name: 'The Council'
                  },
                  create: {
                    name: 'The Council',
                    short_name: 'URC'
                  }
                }
              },
              role_title: member.position,
              start_date,
              end_date
            }
          },
          photo: {
            connect: {
              id: res?.id
            }
          },
          roles: {
            connectOrCreate: {
              where: {
                id: 'researcher'
              },
              create: {
                id: 'researcher',
              }
            }
          }
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  for (const center of centers) {
    try {

      const usersConstructor = await Promise.all(center.users.map(async (member) => {
        const res = await uploadFile(member.image)

        let start_date = null
        let end_date = null

        try {
          const dates = member.duration.replace("–", "-").split("-").map((date) => date.trim())

          start_date = dates[0].split(" ").length > 1 ? (
            parse(dates[0], 'dd MMMM yyyy', new Date())
          ) : (
            dates[0].toLowerCase() === "present" ? null : parse(dates[0], 'yyyy', new Date())
          );

          end_date = dates[1].split(" ").length > 1 ? (
            parse(dates[1], 'dd MMMM yyyy', new Date())
          ) : (
            dates[1].toLowerCase() === "present" ? null : parse(dates[1], 'yyyy', new Date())
          );
        } catch (err) {
        }

        return ({
          profile: {
            connectOrCreate: {
              where: {
                email: member.email
              },
              create: {
                first_name: member.first_name,
                middle_initial: member.middle_initial,
                last_name: member.last_name,
                honorific: member.honorific,
                titles: member.titles,
                email: member.email,
                photo: {
                  connect: {
                    id: res?.id
                  }
                },
              }
            }
          },
          role_title: member.position,
          start_date,
          end_date,
        })
      }))
      
      await prisma.institute.upsert({
        where: { name: center.name },
        update: {},
        create: {
          name: center.name,
          short_name: center.short_name,
          email: center.email,
          contact_number: center.contact_number,
          address: center.address,
          description: center.description,
          /* TODO: research_areas */
          // research_areas: center.research_areas,
          bridge_profiles: {
            create: usersConstructor
          }
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  //*/
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })