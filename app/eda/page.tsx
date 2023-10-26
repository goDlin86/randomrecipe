'use client'

import { useState } from 'react'

const badges = [
  'fish',
  'soup',
  'salad',
  'chicken',
  'meat',
  'pizza'
]

type RecipeData = {
  image: string
  label: string
  url: string
  ingredientLines: Array<string>
}

export default function Home() {
  const [recipe, setRecipe] = useState<RecipeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [q, setQ] = useState('chicken')

  const getRecipes = async () => {
    setIsLoading(true)
    setRecipe(null)
    const r = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.NEXT_PUBLIC_APP_ID}&app_key=${process.env.NEXT_PUBLIC_APP_KEY}&q=${q}&random=true`)
    const data = await r.json() 
    console.log(data)
    setRecipe(data.hits[0].recipe)
    setIsLoading(false)
  }

  return (
    <div className='container mx-auto text-center'>
      <div className='flex mt-8 justify-center'>
        {badges.map((b, i) => (
          <div 
            className={'cursor-pointer p-2 rounded-lg inline-block mx-2 transition '+(b===q ? 'bg-slate-500' : 'bg-slate-800 hover:bg-slate-700')+' font-semibold'} 
            onClick={() => setQ(b)} 
            key={i}
          >
            <img src={'/icons/'+b+'.svg'} />
            <div>{b}</div>
          </div>
        ))}        
      </div>
      <div className='cursor-pointer p-4 rounded-lg bg-slate-800 inline-block mx-auto my-8 transition hover:bg-slate-700 font-semibold' onClick={getRecipes}>Random Recipe</div>

      {isLoading && <div>Loading</div>}
      {recipe &&
          <div className='flex flex-col justify-center md:flex-row'>
            <div className='mx-auto md:mx-0'>
              <img src={recipe.image} className='rounded-lg' />
            </div>
            <div className='p-4'>
              <div className='text-lg font-semibold'>{recipe.label}</div>
              <div className='my-2'>
                {recipe.ingredientLines.map((i, k) => (
                  <div key={k}>{i}</div>
                ))}
              </div>
              <a className='underline' href={recipe.url} target='_blank'>Instructions</a>
            </div>
          </div>
      }
    </div>
  )
}