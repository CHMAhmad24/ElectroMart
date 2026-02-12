import FilterSideBar from '@/components/FilterSideBar'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/ReduxToolkit/productSlice'
import { ArrowUp, ChevronUp, Filter, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Products = () => {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRAnge] = useState([0, 9999])
    const [sortOrder, setSortOrder] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [showGoTop, setShowGoTop] = useState(false)
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${BACKEND_URL}/api/v1/products/getAllProducts`)
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behaviour: 'smooth'
        });
        getAllProducts();
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setShowGoTop(true);
            else setShowGoTop(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (allProducts.length === 0) return;
        let filtered = [...allProducts]

        if (search.trim() !== "") {
            const query = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            )
        }

        if (category !== "All") filtered = filtered.filter(p => p.category === category)
        if (brand !== "All") filtered = filtered.filter(p => p.brand === brand)

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "LowToHigh") filtered.sort((a, b) => a.productPrice - b.productPrice)
        else if (sortOrder === "HighToLow") filtered.sort((a, b) => b.productPrice - a.productPrice)

        dispatch(setProducts(filtered))
    }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProducts();
    }, [])

    return (
        <div className='pt-18 pb-5 px-4 sm:px-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative'>
                <div className='lg:hidden mb-6'>
                    <div className='relative mt-3 -mb-7'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-12 bg-white border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <aside className={`
                    fixed inset-y-0 left-0 z-100 w-[75%] bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-in-out
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:static lg:translate-x-0 lg:block lg:w-64 lg:bg-transparent lg:shadow-none lg:p-0 lg:z-0
                `}>
                    <div className='flex lg:hidden justify-between items-center mb-6 border-b pb-4'>
                        <h2 className='text-xl font-bold'>Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)} className='text-red-500 p-2 hover:bg-red-50 rounded-full'>
                            <X size={24} />
                        </button>
                    </div>

                    <div className='h-[calc(100vh-120px)] lg:h-auto overflow-y-auto'>
                        <FilterSideBar
                            allProducts={allProducts}
                            priceRange={priceRange}
                            search={search}
                            setSearch={setSearch}
                            brand={brand}
                            setBrand={setBrand}
                            category={category}
                            setCategory={setCategory}
                            setPriceRAnge={setPriceRAnge}
                            setIsFilterOpen={setIsFilterOpen} 
                        />
                    </div>
                </aside>

                {/* --- MAIN SECTION --- */}
                <div className='flex flex-col flex-1 lg:mt-6 !lg:-mt-5'>
                    <div className='flex justify-between items-center mb-6 gap-4'>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className='lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md active:scale-95 transition-transform'
                        >
                            <Filter size={18} /> Filters
                        </button>

                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-40 sm:w-50 bg-white cursor-pointer">
                                <SelectValue placeholder="Sort By Price" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectGroup>
                                    <SelectItem className='cursor-pointer' value="LowToHigh">Price: Low to High</SelectItem>
                                    <SelectItem className='cursor-pointer' value="HighToLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 xl:grid-cols-5 gap-6'>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} loading={loading} />
                            ))
                        ) : (
                            <div className='col-span-full text-center py-20 text-gray-500'>
                                No products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showGoTop && (
                <button
                    onClick={scrollToTop}
                    className='fixed bottom-8 right-8 z-90 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all ease-in-out animate-bounce cursor-pointer'
                >
                    <ArrowUp size={28} />
                </button>
            )}

            {isFilterOpen && (
                <div className='fixed inset-0 bg-black/50 z-90 lg:hidden backdrop-blur-sm' onClick={() => setIsFilterOpen(false)} />
            )}
        </div>
    )
}

export default Products
