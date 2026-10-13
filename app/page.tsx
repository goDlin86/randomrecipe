'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const badges = [
  { id: 1, name: 'рыба', icon: 'fish' },
  { id: 2, name: 'суп', icon: 'soup' },
  { id: 3, name: 'салат', icon: 'salad' },
  { id: 4, name: 'курица', icon: 'chicken' },
  { id: 5, name: 'мясо', icon: 'meat' },
  { id: 6, name: 'пицца', icon: 'pizza' }
]

type RecipeData = {
  image: string
  label: string
  url: string
  time: string
  desc: string
  ingredientLines: Array<string>
}

export default function Home() {
  const [recipe, setRecipe] = useState<RecipeData|null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [q, setQ] = useState('курица')

  const getRecipes = async () => {
    if (!isLoading) {
      setIsLoading(true)
      setRecipe(null)
      
      const r = await fetch(`/api/get?q=${q}`)
      const data = await r.json()

      const url = data[Math.floor(Math.random() * data.length)].url
      const resp = await fetch(`/api/getRecipe?url=${url}`)
      const recipe = await resp.json()
      console.log(recipe)

      setRecipe(recipe)
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto text-center'>
      <div className='flex mt-8 justify-center'>
        {badges.map((b, i) => (
          <div 
            className={'cursor-pointer p-2 rounded-lg inline-block mx-0.5 sm:mx-1 md:mx-2 transition font-semibold '+(b.name===q?'bg-slate-500':'bg-slate-800 hover:bg-slate-700')} 
            onClick={() => setQ(b.name)} 
            key={i}
          >
            <img src={'/icons/'+b.icon+'.svg'} className='sm:w-16 w-10' />
            <div className='text-xs sm:text-base '>{b.name}</div>
          </div>
        ))}        
      </div>
      <AnimatePresence mode='wait'>
        {isLoading ?
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className='p-4 my-8 font-semibold'>Загрузка...</div>
          </motion.div> :
          <motion.div
            key='button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className='p-4 rounded-lg inline-block mx-auto my-8 transition font-semibold cursor-pointer bg-slate-800 hover:bg-slate-700' 
              onClick={getRecipes}
            >
              Получить рецепт
            </div>
            {recipe && 
              <div className='flex flex-col justify-center mb-8'>
                <div className='mx-auto'>
                  <img src={recipe.image} className='rounded-lg' />
                </div>
                <div className='p-4'>
                  <div className='text-xl font-semibold'>{recipe.label}</div>
                  <div className='my-2'>{recipe.desc}</div>
                  <div className='my-2 text-sm text-gray-400'>{recipe.time}</div>
                  <div className='my-2'>
                    {recipe.ingredientLines.map((i, k) => (
                      <div className={k === 0 ? 'text-lg font-semibold' : ''} key={k}>{i}</div>
                    ))}
                  </div>
                  <a className='underline my-2' href={'https://www.russianfood.com' + recipe.url} target='_blank'>Инструкции</a>
                </div>
              </div>
            }
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}