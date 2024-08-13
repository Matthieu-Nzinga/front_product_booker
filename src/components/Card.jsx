import React from 'react'

const Card = ({image, title, price}) => {
  return (
    <div className='bg-custom-gradient p-10 rounded-3xl flex flex-col gap-6 border border-customBlue'>
        <div className='rounded-xl flex items-center justify-center p-10 bg-white/50'><img src={image} alt="produit" className='w-[50%] h-[25vh]' /></div>
        <div><h1 className='text-2xl font-semibold text-center capitalize'>{title}</h1></div>
        <div className='flex justify-between items-center'><h1 className='text-2xl font-semibold'>{price} €</h1> <button className='text-base text-white font-semibold bg-customBlue rounded-full px-6 py-1'>Ajouter</button> </div>
    </div>
  )
}

export default Card