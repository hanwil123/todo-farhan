import Link from 'next/link';
import { Button } from './components/atoms/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-black">
      <header className="border-b bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HanTodo</div>
          <Link href="/components/pages/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Manage Your Tasks with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            HanTodo helps teams collaborate efficiently with a simple and elegant task management system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/components/pages/login">
              <Button size="lg" className=' cursor-pointer'>Get Started</Button>
            </Link>
            {/* <Link href="/about">
              <Button size="lg" className=' bg-white cursor-pointer'>
                Learn More
              </Button>
            </Link> */}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} HanTodo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

