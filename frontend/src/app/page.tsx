import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center">
      <h1 className='prose text-4xl mb-4'>Login Page</h1>
      <button className="btn btn-wide"><a href="/dashboard" className='prose text-blue-400'>Visit Dashboard</a></button>
    </main>
  ) 
}
