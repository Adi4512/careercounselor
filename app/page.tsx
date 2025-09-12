export default function Home() {
  return (
    <div className="h-screen bg-[#01030F] text-white relative overflow-hidden">
      {/* Background Stars */}
      {/* <div className="absolute inset-0 overflow-hidden">
       <img src="./stars.webp" alt="stars" className="w-full h-full object-cover" />
      </div> */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 opacity-90  ">
            <img src="./Elements.webp" alt="Elements" className="w-auto h-auto" />
          </div>
      
      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-[#01030F] rounded-full"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <div className="flex items-center space-x-1">
            <span className="text-white">Features</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-white">Developers</span>
          <div className="flex items-center space-x-1">
            <span className="text-white">Company</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-white">Blog</span>
          <span className="text-white">Changelog</span>
        </div>

        {/* Join Waitlist Button */}
        <button className="px-6 py-3 bg-transparent border border-white rounded-lg text-white hover:bg-white hover:text-[#01030F] transition-colors">
          Join waitlist
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-120px)] items-start justify-between px-8">
        {/* Left Side - Text Content */}
        <div className="flex-1 max-w-2xl flex flex-col justify-center h-full">
          {/* New Tag */}
          <div className="inline-block px-4 py-2 bg-black rounded-full text-sm mb-8 border border-gray-600 w-fit">
            NEW Latest integration just arrived
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
            <span className="text-white">Revolutionize Your</span>{' '}
            <span className="text-gray-400">Workflow</span>{' '}
            <span className="text-white">with AI</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white mb-10 leading-relaxed max-w-lg">
            Experience cutting-edge solutions designed to elevate productivity and deliver results like never before.
          </p>

          {/* Get Started Button */}
          <button className="px-8 py-4 bg-transparent border border-white rounded-lg text-lg font-semibold text-white hover:bg-white hover:text-[#01030F] transition-colors w-fit">
            Get Started
          </button>
        </div>

        {/* Right Side - AI Figure */}
        <div className="flex-1 flex items-center justify-center relative h-full">
          
          {/* AI Figure Container */}
          <div className="relative  ml-10 flex items-center justify-center">
            {/* Background Glow Effects - Behind the model */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <img 
                src="./ModelGlow.webp" 
                alt="AI Glow Effect" 
                className="w-[700px] h-[700px] object-contain opacity-90" 
              />
            </div>
            
            {/* AI Model Image */}
            <div className="relative z-20">
              <img 
                src="./AImodel.webp" 
                alt="AI Career Counselor" 
                className="w-[700px] h-[800px] object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
