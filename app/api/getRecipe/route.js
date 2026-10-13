import * as cheerio from 'cheerio'

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get('url')

  const r = await fetch(`https://www.russianfood.com/${url}`)
  const buffer = await r.arrayBuffer()
  const decoder = new TextDecoder('windows-1251')
  const htmlString = decoder.decode(buffer)

  const $ = cheerio.load(htmlString, { xml: { decodeEntities: false } })

  const recipe = {
    label: $('.recipe_new').find('h1.title').text(),
    image: $('.recipe_new').find('.main_image').find('img').attr('src'),
    time: $('.recipe_new').find('.sub_info').find('.ico_time').parent().parent().text().replace(/&nbsp;/g, ''),
    desc: $('.recipe_new').find('#ib_s_e_2').next().text(),
    ingredientLines: $('.recipe_new').find('.ingr > tr').toArray().map(ingr => $(ingr).text()),
    url
  }

  try {
    return Response.json(recipe)
  }
  catch (e) {
    console.log(e)
    return Response.json({ message: e.message }, { status: 500 })
  }
}