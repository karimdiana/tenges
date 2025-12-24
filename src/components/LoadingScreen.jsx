const LoadingScreen = ({ isVisible = true }) => {
  return (
    <div 
      className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 3D Video Loading Animation */}
      <div className="flex flex-col items-center">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-32 h-32 object-cover rounded-lg"
        >
          <source src="/images/3d.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default LoadingScreen; 