const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const rp = require('request-promise')
const cheerio = require('cheerio')

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
      budget: parseFloat($(element).find('td:nth-of-type(8)').text().trim()),
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
      coProponents: $(element).find('td:nth-of-type(3)').text().trim(),
      unit: $(element).find('td:nth-of-type(4)').text().trim(),
      duration: $(element).find('td:nth-of-type(5)').text().trim(),
      cycle: $(element).find('td:nth-of-type(6)').text().trim(),
      budget: parseFloat($(element).find('td:nth-of-type(7)').text().trim()),
      fundSource: $(element).find('td:nth-of-type(8)').text().trim(),
    })
  }).get()

  return result
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
  } catch (err) {
    console.log(err)
  }

  let researches = []
  let presentations = []
  let publications = []

  try {
    [researches, presentations, publications] = await Promise.all([
      scrapeResearches(),
      scrapePresentations(),
      scrapePublications()
    ])
  } catch (err) {
    console.log(err)
  }
  
  researches.forEach(async (research) => {
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
            urc_funded_research_to_unit: {
              create: {
                unit: {
                  connectOrCreate: {
                    where: {
                      name: research.unit
                    },
                    create: {
                      name: research.unit
                    }
                  }
                },
              }
            },
            slug: (slug_raw === undefined || slug_raw.length == 0) ? '' : slug_raw[slug_raw.length - 1],
            research_status_id: 'finished'
          },
        })
      } catch (err) {
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
            slug: (slug_raw === undefined || slug_raw.length == 0) ? '' : slug_raw[slug_raw.length - 1],
            research_status_id: 'finished'
          },
        })
      } catch (err) {
        console.log(err)
      }
    }
  })

  presentations.forEach(async (presentation) => {
    try {
      await prisma.researchPresentation.upsert({
        where: { event_title: presentation.title },
        update: {},
        create: {
          is_external_research: presentation.fundSource !== 'AdDU-URC',
          event_title: presentation.title,
          location: presentation.place,
          research_presentation_to_unit: {
            create: {
              unit: {
                connectOrCreate: {
                  where: {
                    name: presentation.unit
                  },
                  create: {
                    name: presentation.unit
                  }
                }
              },
            }
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
  })

  publications.forEach(async (publication) => {
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
            approved: true,
            journal_publication_to_unit: {
              create: {
                unit: {
                  connectOrCreate: {
                    where: {
                      name: publication.unit
                    },
                    create: {
                      name: publication.unit
                    }
                  }
                },
              }
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
            book_publication_to_unit: {
              create: {
                unit: {
                  connectOrCreate: {
                    where: {
                      name: publication.unit
                    },
                    create: {
                      name: publication.unit
                    }
                  }
                },
              }
            },
          },
        })
      } catch (err) {
        console.log(err)
      }
    }
  })
  
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