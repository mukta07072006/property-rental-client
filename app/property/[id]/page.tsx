import PropertyDetails from '../../../pages/PropertyDetails'

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  return <PropertyDetails id={params.id} />
}
