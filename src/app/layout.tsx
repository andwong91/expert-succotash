import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Toaster />
        <div className="flex min-h-screen bg-menu">
          <div className="flex flex-col justify-between">
            <div className="w-32 md:w-45 lg:w-58 p-4">
              <h1 className="text-2xl">Test Cluster</h1>
              <div className="pt-3 pb-3">
                <hr className="border-gray-600" />
              </div>
              <ul className="text-sm">
                <li key="1" className="pt-0.5 pb-0.5">
                  <Link href="/" className="text-sm text-gray-300 hover:text-white">
                    - Performance Metrics
                  </Link>
                </li>
                <li key="2" className="pt-0.5 pb-0.5">
                  <Link href="/snapshot" className="text-sm text-gray-300 hover:text-white">
                    - Edit Snapshot Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="bg-menu p-4">
              <div className="pt-5 pb-5">
                <hr className="border-gray-600" />
              </div>
              <select className="text-sm w-full">
                <option value="option1">Andrew Wong</option>
              </select>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
