'use client';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-cyan-400 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-cyan-400 text-lg">Loading vision...</p>
      </div>
    </div>
  );
};

export default Loading;