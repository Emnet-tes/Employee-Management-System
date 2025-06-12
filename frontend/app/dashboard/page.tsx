import React from "react";

const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      
      <div className="mt-6 flex items-center space-x-4">
      <a 
        className="mt-2 inline-block rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        href="/performance">
         Performance Page
      </a>
        <a 
            className="mt-2 inline-block rounded-full bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            href="/employees">
         Employees </a>

        <a 
            className="mt-2 inline-block rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            href="/projects">
         attendance </a>
        <a 
            className="mt-2 inline-block rounded-full bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
            href="/schedule"> schedule</a>
            </div>
    </main>
  );
}
export default page;