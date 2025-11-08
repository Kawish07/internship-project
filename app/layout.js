import './globals.css'
import ProvidersWrapper from '../components/Providers'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'AdvertEase',
  description: 'Simple Classified Ads App'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProvidersWrapper>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
          <Footer />
        </ProvidersWrapper>
      </body>
    </html>
  )
}
