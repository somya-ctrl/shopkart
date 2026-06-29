import { useEffect,useState } from "react";
import {Link} from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ListingPage(){
    const[products,setProducts] = useState([]);
    const [loading,setLoading] =useState(true);
    const {addToCart} = useCart();
    useEffect(()=>{
        fetch('https://dummyjson.com/products?limit=194')
        .then(res => res.json())
        .then(data=>{setProducts(data.products);setLoading(false);});
    },[]);
    if(loading){
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800"> All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    products.map(product=>(
                        <div key ={product.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col">
                            <Link to = {`/product/${product.id}`}>
                            <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
                            </Link>
                             <div className="p-4 flex flex-col flex-1">
              <Link to={`/product/${product.id}`}>
                <h2 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 hover:text-blue-600">
                  {product.title}
                </h2>
              </Link>
                    <span className="text-xs text-gray-400 capitalize mb-2">{product.category}</span>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                {product.discountPercentage > 0 && (
                  <span className="ml-auto text-xs text-green-600 font-medium">
                    -{Math.round(product.discountPercentage)}% off
                  </span>
                )}
                 </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
}