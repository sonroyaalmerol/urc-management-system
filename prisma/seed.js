const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cheerio = require('cheerio')
const https = require('https')
const FormData = require('form-data')
const { PassThrough } = require('stream')
// const { fetch } = require('undici')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const centers = require('./centers')
const council = require('./council')

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
  const result = $('#tablepress-3 > tbody').children('tr').map((i, element) => {
    let slug = $(element).find('td:nth-of-type(1)').find('a').attr('href')?.replace('http://research.addu.edu.ph/', '') ?? null;
    return ({
      slug,
      name: $(element).find('td:nth-of-type(1)').text().trim(),
      mainProponent: $(element).find('td:nth-of-type(2)').text().trim(),
      coProponents: $(element).find('td:nth-of-type(3)').text().trim().replace('\n', ', '),
      unit: $(element).find('td:nth-of-type(4)').text().trim(),
      duration: $(element).find('td:nth-of-type(5)').text().trim(),
      cycle: $(element).find('td:nth-of-type(6)').text().trim(),
      budget: parseFloat($(element).find('td:nth-of-type(7)').text().trim().replace(',', '')),
      fundSource: $(element).find('td:nth-of-type(8)').text().trim(),
    })
  }).get()

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

  const res = await fetch(`${process.env.BASE_URL}/api/files/upload?public_access=true`, {
      method: "POST",
      body: formData,
  }).then((res) => res.json())

  return res
}

async function main() {
  try {
    await prisma.researchStatus.upsert({
      where: { id: 'not_implemented' },
      update: {},
      create: {
        id: 'not_implemented',
        comment: 'Not implemented'
      }
    })
  
    await prisma.researchStatus.upsert({
      where: { id: 'on_going' },
      update: {},
      create: {
        id: 'on_going',
        comment: 'On-going'
      }
    })
  
    await prisma.researchStatus.upsert({
      where: { id: 'finished' },
      update: {},
      create: {
        id: 'finished',
        comment: 'Finished'
      }
    })
  
    await prisma.researchStatus.upsert({
      where: { id: 'cancelled' },
      update: {},
      create: {
        id: 'cancelled',
        comment: 'Cancelled'
      }
    })

    await prisma.institute.upsert({
      where: { name: 'The Council' },
      update: {},
      create: {
        name: 'The Council',
        short_name: 'URC'
      }
    })
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
    const slug_raw = research.slug?.split("/")
    if (research.fundSource === 'AdDU-URC') {
      try {
        await prisma.uRCFundedResearch.upsert({
          where: { title: research.name },
          update: {},
          create: {
            title: research.name,
            main_proponents: research.mainProponent,
            co_proponents: research.coProponents,
            duration: research.duration,
            cycle: research.cycle,
            budget: research.budget,
            approved: true,
            units: {
              connectOrCreate: extractUnits(research.unit)
            },
            slug: (slug_raw === undefined || slug_raw.length == 0) ? '' : slug_raw[slug_raw.length - 1],
            research_status_id: 'finished'
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
            main_proponents: research.mainProponent,
            co_proponents: research.coProponents,
            duration: research.duration,
            cycle: research.cycle,
            budget: research.budget,
            verified: true,
            slug: (slug_raw === undefined || slug_raw.length == 0) ? '' : slug_raw[slug_raw.length - 1],
            research_status_id: 'finished'
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
        where: { event_title: presentation.title },
        update: {},
        create: {
          is_external_research: presentation.fundSource !== 'AdDU-URC',
          event_title: presentation.title,
          location: presentation.place,
          units: {
            connectOrCreate: extractUnits(presentation.unit)
          },
          event_date: presentation.date,
          verified: true,
          presentor: presentation.presentor,
          conference: presentation.conference,
          budget: presentation.budget
        },
      })
    } catch (err) {
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
            authors: publication.authors,
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
        console.log(err)
      }
    } else {
      try {
        await prisma.bookPublication.upsert({
          where: { title: publication.title },
          update: {},
          create: {
            title: publication.title,
            authors: publication.authors,
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
        uploads.push(res?.data)
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
      const imageUrl = `${process.env.BASE_URL}/api/files/get/${res?.data?.id}`

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
        const imageUrl = `${process.env.BASE_URL}/api/files/get/${res?.data?.id}`
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