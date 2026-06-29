import { createContext,useContext,useState } from "react";
const CartContext = createContext(undefined);
export function CartProvider({children}){
    const [cart,setCart] = useState([]);
    const addToCart = (product) =>{
        setCart(prev=>{
            const existing = prev.find(item =>item.id === product.id);
            if(existing){
                return prev.map(item =>
                    item.id === product.id ? {...item,quantity:item.quantity+1}:item
                );
            }
            return [...prev,{...product,quantity:1}];
        });
    };
    const removeFromCart = (id) =>{
        setCart(prev => prev.filter(item => item.id!==id));

    };
    const updateQuantity =(id,quantity) =>{
        if(quantity <=0 ){removeFromCart(id);return;}
        setCart(prev => prev.map(item =>item.id === id ?{...item,quantity}:item));
    };
    const cartCount = cart.reduce((sum,item)=> sum + item.quantity,0);
    return (
        <CartContext.Provider value = {{cart,addToCart,removeFromCart,updateQuantity,cartCount}}
        >
            {children}
        </CartContext.Provider>
    );
    
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}