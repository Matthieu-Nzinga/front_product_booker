import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className='flex h-screen'>
      
      <div className='w-[55%] bg-custom-gradient p-10 flex flex-col gap-14 hidden md:flex'>
        <h2 className='font-black text-2xl text-customBlue'>LOGO</h2>
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='font-black text-5xl text-center'>
            <span className='text-customBlue'>Réservez</span> vos{' '}
            <span className='text-customBlue'>Produits</span> en toute sécurité
          </h1>
          <p className="text-customGray font-normal text-base text-center">
            Choisissez vos produits, réservez, puis faites-vous livrer de la plus simple des manières !
          </p>
          <img src="/photo.svg" alt="image" className='w-[300px] object-cover' />
        </div>
      </div>
      
      
      <div className='w-full md:w-[45%] flex justify-center items-center flex-col px-2 md:px-0'>
      <h2 className='font-black text-2xl text-customBlue block md:hidden'>LOGO</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
