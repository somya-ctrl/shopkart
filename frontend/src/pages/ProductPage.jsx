import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => { setProduct(data); setSelectedImage(data.thumbnail); setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">Product not found</div>;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline flex items-center gap-1">
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-80 object-contain rounded-xl bg-gray-50 border mb-4"
          />
          <div className="flex gap-2 flex-wrap">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                  selectedImage === img ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-gray-400 uppercase tracking-wide">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-1 mb-2">{product.title}</h1>
          {product.brand && (
            <p className="text-sm text-gray-500 mb-3">
              Brand: <span className="font-medium text-gray-700">{product.brand}</span>
            </p>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="text-sm text-gray-500">{product.rating.toFixed(1)} / 5</span>
          </div>

          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-bold text-blue-600">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">${product.price}</span>
                <span className="text-sm text-green-600 font-semibold">-{Math.round(product.discountPercentage)}% off</span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>

          <p className={`text-sm font-medium mb-5 ${
            product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                added ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link
              to="/cart"
              className="px-5 py-3 rounded-xl font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Cart
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
            {product.warrantyInformation && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Warranty</div>
                {product.warrantyInformation}
              </div>
            )}
            {product.shippingInformation && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Shipping</div>
                {product.shippingInformation}
              </div>
            )}
            {product.returnPolicy && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Returns</div>
                {product.returnPolicy}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {product.reviews.map((review, i) => (
              <div key={i} className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-800">{review.reviewerName}</span>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
