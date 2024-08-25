import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Card = ({ images, title, id }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className='bg-custom-gradient p-10 rounded-3xl flex flex-col gap-6 border border-customBlue'>
      <div className='rounded-xl flex items-center justify-center p-10 bg-white'>
        <img src={images[0]} alt="produit" className='w-[100%] h-[25vh]' />
      </div>
      <div><h1 className='text-2xl font-semibold text-center capitalize'>{title}</h1></div>
      <div className='flex justify-center items-center'>
        <button
          onClick={handleViewDetails}
          className='text-base text-white font-semibold bg-customBlue rounded-full px-6 py-1'
        >
          Visualiser
        </button>
      </div>
    </div>
  );
};

export default Card;
