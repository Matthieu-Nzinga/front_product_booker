import React from 'react'

const Card = ({image, title, price}) => {
  return (
    <div className='bg-custom-gradient p-10 rounded-3xl'>
        <div className='bg-white rounded-xl '><img src={image} alt="produit" className='w-[230px] h-[260px]  opacity-80' /></div>
        <div>{title}</div>
        <div>{price}</div>
    </div>
  )
}

export default Card