import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="w-full flex">
      {/* Left Section */}
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-purple-100 to-gray-50 lg:flex">
        <div className="relative z-10 w-full max-w-md text-center">
          {/* Larger Logo */}
          <img src="logo.svg" width={200} alt="MockMate Logo" className="mx-auto mb-6" />
          <div className="mt-8 space-y-5">
            {/* Title */}
            <h3 className="text-gray-800 text-3xl font-bold leading-tight">MockMate AI Based Interview</h3>
            {/* Description */}
            <p className="text-gray-600">
              Personalize your experience with the MockMate AI interview website and enhance your communication and personality skills.
            </p>
            {/* User Avatars */}
            <div className="flex items-center justify-center -space-x-2 overflow-hidden mt-5">
              <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User 1" />
              <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User 2" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f" className="w-10 h-10 rounded-full border-2 border-white" alt="User 3" />
              <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User 4" />
              <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" className="w-10 h-10 rounded-full border-2 border-white" alt="User 5" />
              <p className="text-sm text-gray-500 font-medium translate-x-5">Join 5,000+ users</p>
            </div>
          </div>
        </div>
        {/* Background Gradient */}
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
            filter: "blur(118px)"
          }}
        ></div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Mobile Logo */}
            <img src="/logo.svg" width={150} alt="FloatUI Logo" className="lg:hidden mx-auto" />
            <div className="mt-5 space-y-2">
              {/* Sign-In Title */}
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign In</h3>
              <p>
                Already have an account?{" "}
                
              </p>
            </div>
          </div>
          {/* Sign-In Component */}
          <div>
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}