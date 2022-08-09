import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  backgrounds,
  weapons,
  bodys,
  armors,
  mouths,
  eyes,
  heads
} from '../assets'

type IHeroOverview = {
  heroIndex: Array<number>
}
const HeroOverview = ({
  heroIndex
}: IHeroOverview) => {
  const [hero, setHero] = useState({
    background: backgrounds[heroIndex[0]],
    weapon: weapons[heroIndex[1]],
    body: bodys[heroIndex[2]],
    armor: armors[heroIndex[3]],
    mouth: mouths[heroIndex[4]],
    eye: eyes[heroIndex[5]],
    head: heads[heroIndex[6]]
  })

  useEffect(() => {
    setHero({
      background: backgrounds[heroIndex[0]],
      weapon: weapons[heroIndex[1]],
      body: bodys[heroIndex[2]],
      armor: armors[heroIndex[3]],
      mouth: mouths[heroIndex[4]],
      eye: eyes[heroIndex[5]],
      head: heads[heroIndex[6]]
    })
  }, [heroIndex])

  const Imgs = useMemo(() => {
    return Object.entries(hero).map((h, i) => {
      if (heroIndex[i] === -1) return null;

      const name = h[0]
      const data = h[1]
      if (!data?.url) return null;
      return <img src={data?.url} alt={name} key={name} className="absolute w-full h-full object-contain inset-0" />
    })
  }, [hero, heroIndex])

  return (
    <div>
      <div className='aspect-1 relative pointer-events-none bg-white'>{Imgs}</div>
      <div>{heroIndex.slice(0, 7).join(', ')}</div>
    </div>
  )
}

export default HeroOverview;
