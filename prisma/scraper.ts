import cheerio from 'cheerio'
import https from 'https'

// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)');

import type fetchType from 'node-fetch'
const fetch: typeof fetchType = async (...args:any[]) => {
  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = await importDynamic('node-fetch');
  return module.default(...args);
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const rp = async (url) => {
  return (await fetch(url, {
    agent: httpsAgent,
  })).text();
}

export const scrapePublications = async () => {
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

export const scrapePresentations = async () => {
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

export const scrapeResearches = async () => {
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

export const scrapeNews = async () => {
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
              } else if (href.includes('wp-content') && files.includes(href)) {
                $(this).remove()
              }
            })

            $(this).children().each(function () {
              if ($(this).children().length === 0) {
                $(this).remove()
              }
            })

            if ($(this).children().length === 0) {
              $(this).remove()
            }

            description = `${description}${$.html($(this))}`
          })

          return {
            title: currentElement.find("header").find("h2").find("a").text().trim(),
            author: "AdDU - URC",
            date: currentElement
              .find("header")
              .find("div")
              .find("a")
              .find("time.entry-date.published")
              .attr("datetime")
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