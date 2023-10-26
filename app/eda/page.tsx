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

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [q, setQ] = useState('chicken')

  const getRecipes = async () => {
    setIsLoading(true)
    setRecipes([])
    const r = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.NEXT_PUBLIC_APP_ID}&app_key=${process.env.NEXT_PUBLIC_APP_KEY}&q=${q}&random=true`)
    const data = await r.json() 
    console.log(data)
    setRecipes(data.hits)
    setIsLoading(false)
  }

  return (
    <div className='container mx-auto text-center'>
      <div className='flex my-8 justify-center'>
        {badges.map((b, i) => (
          <div 
            className={'cursor-pointer p-2 rounded-lg bg-slate-800 inline-block mx-auto mx-2 transition '+(b === q ? 'bg-slate-500' : 'hover:bg-slate-700')+' font-semibold'} 
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
      {recipes.length > 0 &&
          <div className='flex flex-col justify-center md:flex-row'>
            <div>
              <img src={recipes[0].recipe.image} className='rounded-lg' />
            </div>
            <div className='p-4'>
              <div className='text-lg font-semibold'>{recipes[0].recipe.label}</div>
              <div className='my-2'>
                {recipes[0].recipe.ingredientLines.map((i, k) => (
                  <div key={k}>{i}</div>
                ))}
              </div>
              <a className='underline' href={recipes[0].recipe.url} target='_blank'>Instructions</a>
            </div>
          </div>
      }
    </div>
  )
}