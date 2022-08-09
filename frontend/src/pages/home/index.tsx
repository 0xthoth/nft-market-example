import React, { useState, useCallback, Fragment } from 'react';

import {
  ConnectButton
} from "@rainbow-me/rainbowkit";
import GenerateNft from 'components/GenerateNft'
import HeroOverview from 'components/HeroOverview'

import {
  backgrounds,
  weapons,
  bodys,
  armors,
  mouths,
  eyes,
  heads
} from 'assets'

const Home = () => {
  const [hero, setHero] = useState({
    background: 0,
    weapon: 0,
    body: 0,
    armor: 0,
    mouth: 0,
    eye: 0,
    head: 0
  })

  const handleChangeComponent = ({
    background,
    weapon,
    body,
    armor,
    mouth,
    eye,
    head
  }: any) => () => {
    setHero(h => ({
      background,
      weapon,
      body,
      armor,
      mouth,
      eye,
      head
    }))
  }

  const HeroComponent = useCallback(({
    name,
    items
  }: {
    name: 'background' | 'weapon' | 'body' | 'armor' | 'mouth' | 'eye' | 'head',
    items: any[]
  }): any => {
    return items.map((i, index) => {
      return (
        <Fragment key={hero[name]}>
          {index === 0 && <span key={index - 1} className={`cursor-pointer p-1 m-2 ${hero[name] === -1 ? 'bg-blue-200' : ''}`} onClick={handleChangeComponent({ ...hero, [name]: -1 })}>
            None
          </span>}
          <span key={i.id} className={`cursor-pointer p-1 m-2 ${hero[name] === index ? 'bg-blue-200' : ''}`} onClick={handleChangeComponent({ ...hero, [name]: index })}>
            {i.name}
          </span>
        </Fragment>

      )
    })
  }, [hero])

  return (
    <div>
      <div className=" bg-gray-200 rounded-xl shadow border p-8 my-10">
        <p className="text-3xl text-gray-700 font-bold mb-5">
          Welcome!
        </p>
        <p className="text-gray-500 text-lg">
          Templar Hero NFTs
        </p>
        <ConnectButton />
        <GenerateNft />
      </div>

      <h1>Examples:</h1>
      <div className='flex w-full border border-ink-050 rounded-xl overflow-hidde'>
        <div className='w-1/2 p-6'>
          <div>
            <h3>1. Background</h3>
            <HeroComponent name='background' items={backgrounds} />
          </div>

          <div>
            <h3>2. Weapon</h3>
            <HeroComponent name='weapon' items={weapons} />
          </div>

          <div>
            <h3>3. Body</h3>
            <HeroComponent name='body' items={bodys} />
          </div>

          <div>
            <h3>4. Armor</h3>
            <HeroComponent name='armor' items={armors} />
          </div>

          <div>
            <h3>5. Mouth</h3>
            <HeroComponent name='mouth' items={mouths} />
          </div>

          <div>
            <h3>6. Eye</h3>
            <HeroComponent name='eye' items={eyes} />
          </div>

          <div>
            <h3>7. Head</h3>
            <HeroComponent name='head' items={heads} />
          </div>
        </div>
        <div className='w-1/2 p-6 bg-gray-200 pointer-events-none rounded-tr-xl rounded-br-xl'>
          <HeroOverview heroIndex={Object.values(hero)} />
        </div>
      </div>
    </div>
  )
}

export default Home;