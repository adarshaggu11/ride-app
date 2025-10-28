const SplashScreen = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex flex-col items-center justify-center px-6'>
      <div className='text-center space-y-6'>
        <div className='w-32 h-32 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8'>
          <span className='text-6xl font-bold text-blue-600'>M</span>
        </div>
        <h1 className='text-5xl font-bold text-white'>ManaAuto</h1>
        <p className='text-xl text-white/90'>మన పరయణ. మన రడ.</p>
        <div className='flex items-center justify-center gap-2 pt-4'>
          <div className='w-2 h-2 bg-white rounded-full animate-bounce'></div>
          <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0.15s' }}></div>
          <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
