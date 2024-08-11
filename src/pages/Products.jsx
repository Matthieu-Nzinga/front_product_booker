import React from 'react'
import Header from '../components/Header'
import ProductList from '../components/ProductList'

const Products = () => {
  return (
    <div>
      <Header text={"Les produits"}/>
      <ProductList/>
    </div>
  )
}

export default Products