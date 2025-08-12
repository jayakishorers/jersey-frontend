import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight , ZoomIn, ZoomOut } from 'lucide-react';
import { Jersey } from '../types';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ProductModalProps {
  jersey: Jersey | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  jersey,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!jersey) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => prev === jersey.images.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => prev === 0 ? jersey.images.length - 1 : prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart(jersey, selectedSize, quantity);
    onClose();
  };
const [modalImageIndex, setModalImageIndex] = useState(0);
const [zoom, setZoom] = useState(1);
const [isZoomed, setIsZoomed] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isFullscreen, setIsFullscreen] = useState(false);

const modalImages = [
   "/playervers.jpg",
  "/sublim.jpg",
  "/fanvers.jpg"
];

const prevModalImage = () => {
  setModalImageIndex((prev) =>
    prev === 0 ? modalImages.length - 1 : prev - 1
  );
  resetZoom();
};

const nextModalImage = () => {
  setModalImageIndex((prev) =>
    prev === modalImages.length - 1 ? 0 : prev + 1
  );
  resetZoom();
};

const resetZoom = () => {
  setZoom(1);
  setIsZoomed(false);
};
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-8 bg-white text-gray-900 border border-gray-200 rounded-2xl z-50 overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full border border-gray-300 text-gray-600 hover:text-black"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Section */}
              <div className="lg:w-1/2 relative bg-gray-100">
                <div className="relative h-64 lg:h-full">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={jersey.images[currentImageIndex]}
                    alt={jersey.name}
                    className="w-full h-full object-cover"
                  />
                  {jersey.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full text-gray-700"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full text-gray-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {jersey.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {jersey.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">NEW</span>
                      )}
                      {jersey.isBestSeller && (
                        <span className="px-2 py-1 bg-yellow-300 text-black text-xs font-semibold rounded">BESTSELLER</span>
                      )}
                      {jersey.isTrending && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">TRENDING</span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold">{jersey.name}</h1>
                    <p className="text-lg text-gray-500">{jersey.club}</p>
                  </div>

                  

                  {/* Price */}
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold text-black">Rs.{jersey.price}</span>
                    {jersey.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">Rs.{jersey.originalPrice}</span>
                        <span className="px-3 py-1 bg-red-100 text-red-500 text-sm rounded border border-red-300">
                          Save Rs.{(jersey.originalPrice - jersey.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Type:</span> <p className="font-medium">{jersey.type}</p></div>
                    <div><span className="text-gray-500">Material:</span> <p className="font-medium">{jersey.material}</p></div>
                    <div><span className="text-gray-500">Category:</span> <p className="font-medium">{jersey.category}</p></div>
                    <div><span className="text-gray-500">Full Kit:</span> <p className="font-medium">{jersey.fullKit ? 'Yes' : 'No'}</p></div>
                  </div>

                    {/* Player Name */}
<div>
  <h3 className="text-lg font-semibold mb-3">Player Name</h3>
  <p className="text-gray-700 text-base font-medium">
    {jersey.PlayerName || 'None'}
  </p>
</div>



                  {/* Size Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Select Size</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {jersey.sizes.map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 rounded-lg border-2 transition ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-100 text-blue-600'
                              : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      >
                        -
                      </motion.button>
                      <span className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-center min-w-[60px]">{quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!selectedSize}
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold transition ${
                        selectedSize
                          ? 'bg-blue-600 text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 border border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>

                    {/* Modal Image Section */}
<div className="lg:w-1/2 relative bg-black flex items-center justify-center overflow-hidden rounded-lg select-none">

  {/* Loader */}
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {/* Image */}
  <motion.img
    key={modalImageIndex}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    src={modalImages[modalImageIndex]}
    alt={`Modal jersey view ${modalImageIndex + 1}`}
    onLoad={() => setIsLoading(false)}
    onClick={() => {
      setIsFullscreen(true);
      setIsZoomed(false);
      setZoom(1);
    }}
    style={{
      transform: `scale(${zoom})`,
      cursor: "zoom-in"
    }}
    className="max-h-[500px] w-auto object-contain transition-transform duration-300"
  />

  {/* Left/Right Buttons */}
  {modalImages.length > 1 && !isZoomed && (
    <>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={prevModalImage}
        className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white shadow-lg transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={nextModalImage}
        className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white shadow-lg transition"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </>
  )}

  {/* Dots */}
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
    {modalImages.map((_, index) => (
      <button
        key={index}
        onClick={() => { setModalImageIndex(index); resetZoom(); }}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === modalImageIndex ? 'bg-blue-500 scale-110' : 'bg-gray-400'
        }`}
      />
    ))}
  </div>
</div>

{/* Fullscreen Overlay */}
{isFullscreen && (
  <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">

    {/* Close Button */}
<button
  onClick={() => setIsFullscreen(false)}
  className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition"
  style={{
    touchAction: "manipulation" // Prevent accidental zoom/pan blocking tap
  }}
>
  <span className="text-white text-2xl leading-none">✕</span>
</button>

    {/* Fullscreen Image */}
    <motion.img
      key={modalImageIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      src={modalImages[modalImageIndex]}
      alt={`Fullscreen jersey view ${modalImageIndex + 1}`}
      className="max-h-full max-w-full object-contain cursor-grab"
      style={{
        transform: `scale(${zoom})`,
        transition: "transform 0.3s ease"
      }}
      onClick={() => setIsZoomed(!isZoomed)}
    />

    {/* Navigation Arrows */}
    {modalImages.length > 1 && (
      <>
        <motion.button
          onClick={prevModalImage}
          className="absolute left-6 p-4 bg-black/40 hover:bg-black/60 rounded-full text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={nextModalImage}
          className="absolute right-6 p-4 bg-black/40 hover:bg-black/60 rounded-full text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </>
    )}

    {/* Zoom Controls */}
    {isZoomed && (
      <div className="absolute bottom-6 right-6 flex space-x-3">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
          className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
          className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
      </div>
    )}
  </div>
)}
<p className="mt-4 text-center text-sm md:text-base font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
  📏"Find your perfect fit using the size chart for your jersey type."
</p>
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700">{jersey.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      {jersey.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
