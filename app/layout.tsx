// ... existing code ...
import './globals.css'
import { Mochiy_Pop_One } from 'next/font/google';

const font = Mochiy_Pop_One({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: '海のビンゴ大会',
  description: '海のビンゴ大会',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={font.className}>
      <body className="bg-gradient-to-b from-blue-100 via-cyan-100 to-teal-100 min-h-screen">{children}</body>
    </html>
  )
}
