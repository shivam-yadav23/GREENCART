import { createContext , useContext , useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast"
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const Navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    // Fetch Seller Status
    const fetchSeller = async ()=>{
        try{
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        }catch(error){
            setIsSeller(false);
        }
    }

    // Fetch User Auth Status, User Data and Cart Items
    const fetchUser = async ()=>{
        try{
            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        }catch(error){
            setUser(null)
        }
    }


    // Fetch All Products
    const fetchProducts = async ()=>{
        try{
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //Add products to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        
        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart")
        console.log(cartData);
    }

    // Update Cart items Quantity
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("cart Updated")
    }

    // Remove product from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("removed from the cart")
        setCartItems(cartData)
    }

    // Get cart Items Count
    const getCartCount = ()=>{
        let count = 0;
        for(const item in cartItems){
            count += cartItems[item];
        }
        return count;
    }

    // Get cart Total Amount
    const getCartAmount = ()=>{
        let amount = 0;
        for(const item in cartItems){
           const itemInfo = products.find((product)=> product._id === item);
           if(cartItems[item] > 0){
            amount += itemInfo.offerPrice * cartItems[item];
           }
        }
        return Math.floor(amount * 100) / 100;
    }

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart = async ()=>{
            try{
                const {data} = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            }catch(error){
                toast.error(error.message)
            }
        }

        if(user){
            updateCart();
        }
    }, [cartItems])

    const value = {Navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,
        products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery,
        setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems
    }
    return <AppContext.Provider value = {value}>
        {children}
    </AppContext.Provider>
}
export const useAppContext = ()=>{
    return useContext(AppContext)
}
