import Image from 'next/image'

interface Item {
  id: number
  title: string
  price: number
  image: string
  seller: string
}

export function MarketplaceItem({ item }: { item: Item }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col">
      <Image src={item.image} alt={item.title} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
      <p className="text-gray-600 mb-2 overflow-hidden">${item.price.toFixed(2)}</p>
      <p className="text-gray-500 mb-4 overflow-hidden truncate">Seller: {item.seller}</p>
      <button 
        className="bg-indigo-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-600"
        onClick={() => window.location.href = `/marketplace/${item.id}`}
      >
        View Details
      </button>
    </div>
  )
}

