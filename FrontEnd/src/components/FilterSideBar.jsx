import React from 'react'
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const FilterSideBar = ({
  allProducts,
  priceRange,
  search,
  setSearch,
  brand,
  setBrand,
  category,
  setCategory,
  setPriceRAnge,
  setIsFilterOpen
}) => {

  const uniqueCategory = ["All", ...new Set(allProducts.map(p => p.category))]
  const uniqueBrands = ["All", ...new Set(allProducts.map(p => p.brand))]

  const handleMobileClose = () => {
    if (window.innerWidth < 1024) {
      setIsFilterOpen(false);
    }
  }

  const handleMinChange = (e) => {
    const value = Number(e.target.value)
    if (value <= priceRange[1]) setPriceRAnge([value, priceRange[1]])
  }

  const handleMaxChange = (e) => {
    const value = Number(e.target.value)
    if (value >= priceRange[0]) setPriceRAnge([priceRange[0], value])
  }

  const resetFilters = () => {
    setSearch("")
    setCategory("All")
    setBrand("All")
    setPriceRAnge([0, 9999])
    handleMobileClose();
  }

  return (
    <div className='w-full'>
      {/* Search */}
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase text-gray-500 mb-2'>Search</p>
        <Input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Dropdown (Updated to match Brands) */}
      <div className='mb-6 overflow-hidden p-1'>
        <h1 className='font-semibold text-lg mb-3 text-gray-800'>Category</h1>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            handleMobileClose();
          }}
        >
          <SelectTrigger className="w-full h-11 bg-white border-slate-200 text-black shadow-sm transition-all duration-200 rounded-xl cursor-pointer">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>

          <SelectContent position="popper" className="z-[9999] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl rounded-xl max-h-[300px]">
            <SelectGroup className="p-1">
              {uniqueCategory.map((item, index) => (
                <SelectItem
                  key={index}
                  value={item}
                  className="w-60 rounded-lg py-2.5 px-3 focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
                >
                  <span className="text-sm font-medium tracking-wide">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Brands */}
      <div className='mb-6 overflow-hidden p-1'>
        <h1 className='font-semibold text-lg mb-3 text-gray-800'>Brands</h1>
        <Select
          value={brand}
          onValueChange={(value) => {
            setBrand(value);
            handleMobileClose();
          }}
        >
          <SelectTrigger className="w-full h-11 bg-white border-slate-200 text-black shadow-sm transition-all duration-200 rounded-xl cursor-pointer">
            <SelectValue placeholder="Select a Brand" />
          </SelectTrigger>

          <SelectContent position="popper" className="z-[9999] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl rounded-xl max-h-[300px]">
            <SelectGroup className="p-1">
              {uniqueBrands && uniqueBrands.length > 0 ? (
                uniqueBrands.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item}
                    className="w-60 rounded-lg py-2.5 px-3 focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
                  >
                    <span className="text-sm font-medium tracking-wide">
                      {item.toUpperCase()}
                    </span>
                  </SelectItem>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-slate-400 italic">
                  No brands found
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Section */}
      <div className='mb-6'>
        <h1 className='font-semibold text-lg mb-2 text-gray-800'>Price Range</h1>
        <div className='bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4'>
          <p className='text-xs text-blue-700 font-bold'>
            $ {priceRange[0].toLocaleString()} - $ {priceRange[1].toLocaleString()}
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex gap-2 items-center'>
            <input type="number" className='w-full p-2 text-xs border border-gray-300 rounded-md outline-none' value={priceRange[0]} onChange={handleMinChange} />
            <span className='text-gray-400'>-</span>
            <input type="number" className='w-full p-2 text-xs border border-gray-300 rounded-md outline-none' value={priceRange[1]} onChange={handleMaxChange} />
          </div>

          <div className='px-1'>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={handleMinChange}
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(priceRange[0] / 1000) * 100}%, #e5e7eb ${(priceRange[0] / 1000) * 100}%, #e5e7eb 100%)`,
              }}
              className='w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4'
            />
            <input
              type="range"
              min="0"
              max="9999"
              step="100"
              value={priceRange[1]}
              onChange={handleMaxChange}
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(priceRange[1] / 9999) * 100}%, #e5e7eb ${(priceRange[1] / 9999) * 100}%, #e5e7eb 100%)`,
              }}
              className='w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-600'
            />
          </div>
        </div>
      </div>

      <Button
        onClick={resetFilters}
        variant="outline"
        className="mt-4 w-full py-6 rounded-xl font-bold border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all"
      >
        Reset All Filters
      </Button>
    </div>
  )
}

export default FilterSideBar
