const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const slugify = require('slugify')

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

const cheerio = require('cheerio')
const https = require('https')
const FormData = require('form-data')
// const { fetch } = require('undici')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const centers = require('./data/centers')
const council = require('./data/council')

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const rp = async (url) => {
  return (await fetch(url, {
    agent: httpsAgent,
  })).text();
}

const scrapePublications = async () => {
  const JOURNAL_URL = 'https://research.addu.edu.ph/journal-publications/';
  const BOOK_URL = 'https://research.addu.edu.ph/book-publications-3/';

  const [html, html_2] = await Promise.all([rp(JOURNAL_URL), rp(BOOK_URL)]);
  const $ = cheerio.load(html);
  const $$ = cheerio.load(html_2);
  const result = [
    ...$('#tablepress-4 > tbody').children('tr').map((i, element) => {
      return ({
        type: 'journal',
        title: $(element).find('td:nth-of-type(1)').text().trim(),
        authors: $(element).find('td:nth-of-type(2)').text().trim(),
        journal: $(element).find('td:nth-of-type(3)').text().trim(),
        datePublished: $(element).find('td:nth-of-type(4)').text().trim(),
        link: $(element).find('td:nth-of-type(5)').text().trim(),
        issn: $(element).find('td:nth-of-type(6)').text().trim(),
        indexed: $(element).find('td:nth-of-type(7)').text().trim(),
        unit: $(element).find('td:nth-of-type(8)').text().trim(),
      })
    }).get(),
    ...$$('#tablepress-5 > tbody').children('tr').map((i, element) => {
      return ({
        type: 'book',
        title: $(element).find('td:nth-of-type(1)').text().trim(),
        authors: $(element).find('td:nth-of-type(2)').text().trim(),
        publisher: $(element).find('td:nth-of-type(3)').text().trim(),
        isbn: $(element).find('td:nth-of-type(4)').text().trim(),
        datePublished: $(element).find('td:nth-of-type(5)').text().trim(),
        unit: $(element).find('td:nth-of-type(6)').text().trim(),
      })
    }).get()
  ]

  return result
}

const scrapePresentations = async () => {
  const URL = 'https://research.addu.edu.ph/conference-presentations/';
  const html = await rp(URL);
  const $ = cheerio.load(html);
  const result = $('#tablepress-6 > tbody').children('tr').map((i, element) => {
    return ({
      title: $(element).find('td:nth-of-type(1)').text().trim(),
      presentor: $(element).find('td:nth-of-type(2)').text().trim(),
      conference: $(element).find('td:nth-of-type(3)').text().trim(),
      date: $(element).find('td:nth-of-type(4)').text().trim(),
      link: $(element).find('td:nth-of-type(5)').text().trim(),
      place: $(element).find('td:nth-of-type(6)').text().trim(),
      unit: $(element).find('td:nth-of-type(7)').text().trim(),
      budget: parseFloat($(element).find('td:nth-of-type(8)').text().trim().replace(',', '')),
      fundSource: $(element).find('td:nth-of-type(9)').text().trim(),
    })
  }).get()

  return result
}

const scrapeResearches = async () => {
  const URL = 'https://research.addu.edu.ph/university-funded-researches';
  const html = await rp(URL);
  const $ = cheerio.load(html);
  const result = await Promise.all($('#tablepress-3 > tbody').children('tr').map(async (i, element) => {
    const moreDetailsUrl = $(element).find('td:nth-of-type(1)').find('a').attr('href')?.replace('http:', 'https:') ?? null;
    const name = $(element).find('td:nth-of-type(1)').text().trim()

    let dateCompleted = ""
    let keywords = []
    let abstract = ""

    if (moreDetailsUrl) {
      const moreHtml = await rp(moreDetailsUrl)
      const $$ = cheerio.load(moreHtml)

      let entryContent = $$('article > .entry-content').children('p')
      
      keywords = entryContent.filter((i, entry) => {
        const textEntry = $$.html(entry)
        return textEntry.includes('KEYWORDS:')
      }).text().replace('KEYWORDS:', '').split(',').map((i) => i.trim()).filter((i) => i)

      dateCompleted = entryContent.filter((i, entry) => {
        const textEntry = $$.html(entry)
        return textEntry.includes('DATE COMPLETED:')
      }).text().replace('DATE COMPLETED:', '').trim()

      abstract = entryContent.toArray().filter((entry) => {
        const FORBIDDEN_WORDS = [
          'AUTHOR',
          'ABSTRACT',
          'KEYWORDS:',
          'DATE COMPLETED:',
          'contact-form-7',
          'Request for Full Article'
        ]
        const textEntry = $$.html(entry)

        let hasForbidden = false
        for (let wordIndex in FORBIDDEN_WORDS) {
          const word = FORBIDDEN_WORDS[wordIndex]
          if (textEntry.includes(word)) {
            hasForbidden = true
            break
          }
        }

        return !hasForbidden
      }).map((entry) => $$.html(entry)).join('')
    }

    return ({
      name,
      mainProponent: $(element).find('td:nth-of-type(2)').text().trim(),
      coProponents: $(element).find('td:nth-of-type(3)').text().trim().replace('\n', ', '),
      unit: $(element).find('td:nth-of-type(4)').text().trim(),
      duration: $(element).find('td:nth-of-type(5)').text().trim(),
      cycle: $(element).find('td:nth-of-type(6)').text().trim(),
      budget: parseFloat($(element).find('td:nth-of-type(7)').text().trim().replace(',', '')),
      fundSource: $(element).find('td:nth-of-type(8)').text().trim(),
      dateCompleted,
      keywords,
      abstract
    })
  }).get())

  return result
}

const scrapeNews = async () => {
  let news = []
  const links = [
    "https://research.addu.edu.ph/category/memos/page/1/",
    "https://research.addu.edu.ph/category/memos/page/2/",
    "https://research.addu.edu.ph/category/memos/page/3/",
    "https://research.addu.edu.ph/category/memos/page/4/",
  ];

  for (let link of links) {
    const html = await rp(link);
    const $ = cheerio.load(html);

    news = [
      ...news, 
      ...$("#main")
        .children("article")
        .map((i, element) => {
          let currentElement = $(element);

          let description = ''
          let files = []
          currentElement.find('.entry-content').children().each(function () {
            $(this).find('a').each(function () {
              const href = $(this).attr('href')

              if (href.includes('wp-content') && !files.includes(href)) {
                files.push(href)
                $(this).remove()
              }
            })
            description = `${description}${$.html($(this))}`
          })

          return {
            title: currentElement.find("header").find("h2").find("a").text().trim(),
            author: "AdDU - URC",
            date: currentElement
              .find("header")
              .find("div")
              .find("a")
              .find("time:nth-of-type(1)")
              .text()
              .trim(),
            description,
            files,
            link:
              currentElement
                .find("div")
                .find("div:nth-of-type(1)")
                .find("a:nth-of-type(1)")
                .attr("href") ?? null,
          };
        })
        .get()
    ]
  }

  return news
}

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
  const getBuffer = () => new Promise((resolve, reject) => {
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
  
  const formData = new FormData();
  formData.append("file", buffer, {
    contentType: mimeType,
    filename: filename
  })

  const res = await fetch(`${process.env.BASE_URL}/api/files/upload?public_access=true&secret=${process.env.GOOGLE_DRIVE_FOLDER}`, {
      method: "POST",
      body: formData,
  }).then((res) => res.json())

  return res
}

async function main() {
  try {

    await prisma.$transaction([
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
        where: { id: 'default' },
        update: {},
        create: {
          id: 'default',
          comment: 'Default Role'
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
      })
    ])

  } catch (err) {
    console.log(err)
  }

  let researches = []
  let presentations = []
  let publications = []
  let news = []

  try {
    [researches, presentations, publications, news] = await Promise.all([
      scrapeResearches(),
      scrapePresentations(),
      scrapePublications(),
      scrapeNews()
    ])
  } catch (err) {
    console.log(err)
  }

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
        await prisma.project.upsert({
          where: { title: research.name },
          update: {},
          create: {
            title: research.name,
            main_proponents: research.mainProponent.split(',').map((i) => i.trim()).filter((i) => i),
            co_proponents: research.coProponents.split(',').map((i) => i.trim()).filter((i) => i),
            duration: research.duration,
            cycle: research.cycle,
            budget: research.budget,
            approved: true,
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
            main_proponents: research.mainProponent.split(',').map((i) => i.trim()).filter((i) => i),
            co_proponents: research.coProponents.split(',').map((i) => i.trim()).filter((i) => i),
            duration: research.duration,
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

  for (const article of news) {
    try {
      const uploads = []
      for (const fileUrlIndex in article.files) {
        const fileUrl = article.files[fileUrlIndex]
        const res = await uploadFile(fileUrl)
        uploads.push(res)
      }

      //*/
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
          }
        },
      })
      //*/
    } catch (err) {
      console.log(err)
    }
  }

  for (const member of council) {
    try {
      const res = await uploadFile(member.image)
      const imageUrl = `${process.env.BASE_URL}/api/files/get/${res?.id}`

      await prisma.user.upsert({
        where: { email: member.email },
        update: {},
        create: {
          email: member.email,
          first_name: member.first_name,
          middle_initial: member.middle_initial,
          last_name: member.last_name,
          honorific: member.honorific,
          titles: member.titles,
          image: imageUrl,
          name: `${member.honorific ? `${member.honorific} ` : ''}${member.first_name} ${member.middle_initial} ${member.last_name}${member.titles ? `, ${member.titles}` : ''}`,
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
              duration: member.duration
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
        const imageUrl = `${process.env.BASE_URL}/api/files/get/${res?.id}`
        return ({
          user: {
            connectOrCreate: {
              where: {
                email: member.email,
              },
              create: {
                email: member.email,
                first_name: member.first_name,
                middle_initial: member.middle_initial,
                last_name: member.last_name,
                honorific: member.honorific,
                titles: member.titles,
                image: imageUrl,
                name: `${member.honorific ? `${member.honorific} ` : ''}${member.first_name} ${member.middle_initial} ${member.last_name}${member.titles ? `, ${member.titles}` : ''}`,
              }
            }
          },
          role_title: member.position,
          duration: member.duration
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
          research_areas: center.research_areas,
          bridge_users: {
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