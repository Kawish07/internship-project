import AdsList from '../components/AdsList'

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Latest Ads</h1>
      <AdsList />
    </div>
  )
}
