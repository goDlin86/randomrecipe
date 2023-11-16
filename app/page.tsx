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
  const [recipe, setRecipe] = useState<RecipeData|null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [q, setQ] = useState('chicken')

  const getRecipes = async () => {
    if (!isLoading) {
      setIsLoading(true)
      setRecipe(null)
      const r = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.NEXT_PUBLIC_APP_ID}&app_key=${process.env.NEXT_PUBLIC_APP_KEY}&q=${q}&random=true`)
      const data = await r.json() 
      console.log(data)
      setRecipe(data.hits[0].recipe)
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto text-center'>
      <div className='flex mt-8 justify-center'>
        {badges.map((b, i) => (
          <div 
            className={'cursor-pointer p-2 rounded-lg inline-block mx-0.5 sm:mx-1 md:mx-2 transition font-semibold '+(b===q?'bg-slate-500':'bg-slate-800 hover:bg-slate-700')} 
            onClick={() => setQ(b)} 
            key={i}
          >
            <img src={'/icons/'+b+'.svg'} className='sm:w-16 w-10' />
            <div className='text-xs sm:text-base '>{b}</div>
          </div>
        ))}        
      </div>
      {isLoading ?
        <div className='p-4 my-8 font-semibold'>Loading...</div> :
        <div 
          className='p-4 rounded-lg inline-block mx-auto my-8 transition font-semibold cursor-pointer bg-slate-800 hover:bg-slate-700' 
          onClick={getRecipes}
        >
          Get Random Recipe
        </div>
      }

      {recipe &&
          <div className='flex flex-col justify-center md:flex-row mb-8'>
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