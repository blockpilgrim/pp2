import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-end mb-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </Link>
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Partner Lead Management Portal V2.0</h1>
          
          <h2 className="text-xl font-semibold mb-4">POC Modules:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/poc/core" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
              <h3 className="text-lg font-medium">Core Infrastructure POC</h3>
              <p className="text-gray-500">Dataverse integration, error handling, configuration</p>
            </Link>
            
            <Link href="/poc/auth" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
              <h3 className="text-lg font-medium">Authentication POC</h3>
              <p className="text-gray-500">Authentication and Authorization</p>
            </Link>
            
            <Link href="/poc/bff" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
              <h3 className="text-lg font-medium">BFF POC</h3>
              <p className="text-gray-500">Backend-for-Frontend pattern</p>
            </Link>
            
            <Link href="/poc/ui" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50">
              <h3 className="text-lg font-medium">UI Framework POC</h3>
              <p className="text-gray-500">Component system and styling</p>
            </Link>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Upcoming POCs:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 opacity-50 pointer-events-none">
              <h3 className="text-lg font-medium">State Management POC</h3>
              <p className="text-gray-500">Coming soon at /poc/state</p>
            </Link>
            
            <Link href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 opacity-50 pointer-events-none">
              <h3 className="text-lg font-medium">Lead Management POC</h3>
              <p className="text-gray-500">Coming soon at /poc/leads</p>
            </Link>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}