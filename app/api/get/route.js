import * as cheerio from 'cheerio'

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')

  const r = await fetch(`https://www.russianfood.com/search/simple/index.php?ssgrtype=bytype&sskw_title=${encodeURIComponentWin1251(q)}`)
  const buffer = await r.arrayBuffer()
  const decoder = new TextDecoder('windows-1251')
  const htmlString = decoder.decode(buffer)

  const $ = cheerio.load(htmlString, { xml: { decodeEntities: false } })

  const recipes = $('.rcplist_rcp_wi2').toArray().map((recipe) => ({
    title: $(recipe).find('.rcp_wi_title').text(),
    url: $(recipe).find('.rcp_wi_title > a').attr('href')
  }))

  try {
    return Response.json(recipes)
  }
  catch (e) {
    console.log(e)
    return Response.json({ message: e.message }, { status: 500 })
  }
}

function encodeURIComponentWin1251(str) {
  const win1251 = {
    'А': '%C0', 'Б': '%C1', 'В': '%C2', 'Г': '%C3', 'Д': '%C4', 'Е': '%C5', 'Ж': '%C6', 'З': '%C7',
    'И': '%C8', 'Й': '%C9', 'К': '%CA', 'Л': '%CB', 'М': '%CC', 'Н': '%CD', 'О': '%CE', 'П': '%CF',
    'Р': '%D0', 'С': '%D1', 'Т': '%D2', 'У': '%D3', 'Ф': '%D4', 'Х': '%D5', 'Ц': '%D6', 'Ч': '%D7',
    'Ш': '%D8', 'Щ': '%D9', 'Ъ': '%DA', 'Ы': '%DB', 'Ь': '%DC', 'Э': '%DD', 'Ю': '%DE', 'Я': '%DF',
    'а': '%E0', 'б': '%E1', 'в': '%E2', 'г': '%E3', 'д': '%E4', 'е': '%E5', 'ж': '%E6', 'з': '%E7',
    'и': '%E8', 'й': '%E9', 'к': '%EA', 'л': '%EB', 'м': '%EC', 'н': '%ED', 'о': '%EE', 'п': '%EF',
    'р': '%F0', 'с': '%F1', 'т': '%F2', 'у': '%F3', 'ф': '%F4', 'х': '%F5', 'ц': '%F6', 'ч': '%F7',
    'ш': '%F8', 'щ': '%F9', 'ъ': '%FA', 'ы': '%FB', 'ь': '%FC', 'э': '%FD', 'ю': '%FE', 'я': '%FF',
    'Ё': '%A8', 'ё': '%B8'
  }

  return str.split('').map(char => {
    if (win1251[char] !== undefined) {
      return win1251[char]
    }
    return encodeURIComponent(char)
  }).join('')
}