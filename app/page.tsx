import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
          
          {/* Theme Information for POC */}
          <div className="mb-8 p-4 bg-card border border-border rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Multi-State Theme Architecture</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This portal supports state-specific branding through Dynamics 365 role assignments. Users with state 
              assignments (e.g., "state:arkansas" in their D365 roles) will be offered their state's theme on login.
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>How it works:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>State assignments in D365 use prefix notation: <code className="text-xs bg-muted px-1 py-0.5 rounded">state:arkansas</code></li>
                <li>Tennessee users get green theme, Arkansas users get orange theme</li>
                <li>Users can manually override using the theme switcher</li>
                <li>Theme choice is saved in cookies to prevent flashing on page loads</li>
              </ul>
              <p className="mt-3"><strong>D365 Configuration Example:</strong></p>
              <code className="text-xs bg-muted px-2 py-1 rounded block">
                crda6_portalroles = "role:partner,state:arkansas"
              </code>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">POC Modules:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/poc/auth" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:bg-accent transition-colors">
              <h3 className="text-lg font-medium text-card-foreground">Authentication POC</h3>
              <p className="text-muted-foreground">Authentication and Authorization</p>
            </Link>
            
            <Link href="/poc/bff" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:bg-accent transition-colors">
              <h3 className="text-lg font-medium text-card-foreground">BFF POC</h3>
              <p className="text-muted-foreground">Backend-for-Frontend pattern</p>
            </Link>
            
            <Link href="/poc/ui" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:bg-accent transition-colors">
              <h3 className="text-lg font-medium text-card-foreground">UI Framework POC</h3>
              <p className="text-muted-foreground">Component system and styling</p>
            </Link>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Upcoming POCs:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="#" className="block p-6 bg-card border border-border rounded-lg shadow-sm opacity-50 pointer-events-none">
              <h3 className="text-lg font-medium text-card-foreground">State Management POC</h3>
              <p className="text-muted-foreground">Coming soon at /poc/state</p>
            </Link>
            
            <Link href="#" className="block p-6 bg-card border border-border rounded-lg shadow-sm opacity-50 pointer-events-none">
              <h3 className="text-lg font-medium text-card-foreground">Lead Management POC</h3>
              <p className="text-muted-foreground">Coming soon at /poc/leads</p>
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