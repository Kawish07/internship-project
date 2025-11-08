import AdForm from '../../../../components/AdForm'
import { connectToDB } from '../../../../lib/mongodb'
import Ad from '../../../../models/Ad'

export default async function EditPage({ params }) {
  await connectToDB()
  const ad = await Ad.findById(params.id).lean()
  if (!ad) return <div>Not found</div>

  return (
    <div>
      <h2 className="text-2xl mb-4">Edit Ad</h2>
      {/* Render AdForm as client component by marking default export client in AdForm */}
  <AdForm initial={ad} redirectPath={'/dashboard'} />
    </div>
  )
}
