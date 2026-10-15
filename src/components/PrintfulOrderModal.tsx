import React, { useState } from 'react';
import { MintRecord, PrintSize, PrintProductType, ShippingAddress } from '../types';
import { X, ShoppingBag, Truck, Check, Loader2, PackageCheck, AlertCircle, Eye, Maximize2, Sparkles } from 'lucide-react';

interface PrintfulOrderModalProps {
  mintRecord: MintRecord;
  onClose: () => void;
}

const SIZE_OPTIONS: { id: PrintSize; label: string; widthPx: number; heightPx: number; priceBase: number }[] = [
  { id: 'A4 (8.3" x 11.7")', label: 'A4 (8.3" × 11.7")', widthPx: 95, heightPx: 134, priceBase: 28 },
  { id: 'A3 (11.7" x 16.5")', label: 'A3 (11.7" × 16.5")', widthPx: 125, heightPx: 176, priceBase: 38 },
  { id: 'A2 (16.5" x 23.4")', label: 'A2 (16.5" × 23.4")', widthPx: 160, heightPx: 226, priceBase: 58 },
  { id: 'A1 (23.4" x 33.1")', label: 'A1 (23.4" × 33.1")', widthPx: 210, heightPx: 297, priceBase: 88 },
  { id: '12" x 18"', label: '12" × 18" Fine Art', widthPx: 130, heightPx: 195, priceBase: 42 },
  { id: '18" x 24"', label: '18" × 24" Gallery', widthPx: 170, heightPx: 226, priceBase: 65 },
  { id: '24" x 36"', label: '24" × 36" Exhibition', widthPx: 210, heightPx: 315, priceBase: 95 },
  { id: '12" x 12"', label: '12" × 12" Square', widthPx: 130, heightPx: 130, priceBase: 35 },
  { id: '24" x 24"', label: '24" × 24" Large Square', widthPx: 200, heightPx: 200, priceBase: 75 }
];

const FORMAT_MULTIPLIERS: Record<PrintProductType, number> = {
  'Poster Print': 1.0,
  'Canvas Print': 1.4,
  'Framed Print': 1.8
};

export const PrintfulOrderModal: React.FC<PrintfulOrderModalProps> = ({
  mintRecord,
  onClose
}) => {
  const [printSize, setPrintSize] = useState<PrintSize>('A3 (11.7" x 16.5")');
  const [productType, setProductType] = useState<PrintProductType>('Framed Print');
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: mintRecord.artist_name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    countryCode: 'US',
    postalCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSizeConfig = SIZE_OPTIONS.find((s) => s.id === printSize) || SIZE_OPTIONS[1];
  const totalPrice = Math.round(selectedSizeConfig.priceBase * FORMAT_MULTIPLIERS[productType]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.addressLine1 || !shipping.city || !shipping.postalCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/printful/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          printSize,
          productType,
          shipping,
          price: totalPrice,
          unique_id: mintRecord.unique_id,
          image_url: mintRecord.generated_image_url
        })
      });

      const data = await res.json();
      if (data.orderNumber) {
        setOrderConfirmation(data.orderNumber);
      } else {
        throw new Error(data.error || 'Failed to submit Printful order');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#16161e] border border-white/15 rounded-2xl w-full max-w-[960px] p-5 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[92vh] text-left">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c8c5cb] hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmation ? (
          /* Success Screen */
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#5adace]/15 border border-[#5adace] flex items-center justify-center text-[#5adace] mb-4">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-white mb-2">
              Print Order Submitted!
            </h2>
            <p className="font-body-base text-sm text-[#c8c5cb]/80 mb-4 max-w-md">
              Your museum-quality physical {productType} ({printSize}) has been routed to Printful production.
            </p>

            <div className="p-4 bg-[#0a0a0f] border border-white/10 rounded-xl font-label-mono text-xs text-[#5adace] mb-6">
              Order Confirmation #: <span className="font-bold text-white">{orderConfirmation}</span>
            </div>

            <p className="font-metadata text-xs text-[#c8c5cb]/60 mb-6 max-w-sm">
              Your physical print includes the scannable QR code permanently baked into the canvas bottom corner, linking to your digital acoustic NFT.
            </p>

            <button
              onClick={onClose}
              className="py-3 px-8 bg-[#f7fafc] text-black font-label-mono text-xs font-bold rounded-xl hover:bg-white cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>
        ) : (
          /* Order & Room Mockup Form */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Interactive Living Room Mockup Wall Preview */}
            <div className="lg:col-span-5 w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-mono text-[11px] text-[#5adace] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#5adace]" />
                  Living Room Wall Mockup
                </span>
                <span className="font-label-mono text-[10px] text-[#b794f4] bg-[#b794f4]/15 px-2 py-0.5 rounded border border-[#b794f4]/30">
                  {selectedSizeConfig.label}
                </span>
              </div>

              {/* Room Environment Container */}
              <div className="relative w-full h-[320px] sm:h-[380px] bg-[#1a1923] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4">
                
                {/* Wall Background & Subtle Lighting Radial */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#242330] via-[#1a1923] to-[#121118]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#5adace]/10 blur-3xl rounded-full pointer-events-none" />

                {/* Living Room Sofa Shadow Base */}
                <div className="absolute bottom-0 w-full h-24 bg-[#0d0c12] border-t border-white/5 flex flex-col items-center justify-end p-2 opacity-90">
                  <div className="w-4/5 h-12 bg-[#1b1a26] border border-white/10 rounded-t-xl shadow-2xl relative">
                    <span className="text-[9px] font-label-mono text-[#c8c5cb]/40 absolute bottom-1 left-1/2 -translate-x-1/2">
                      Standard 6ft Modern Living Room Sofa
                    </span>
                  </div>
                </div>

                {/* Dynamic Framed Artwork Mounted on Wall */}
                <div className="relative z-10 flex items-center justify-center transition-all duration-300 my-auto">
                  
                  {/* Dimension Line: Top Horizontal */}
                  <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-[#5adace] font-label-mono text-[10px] font-bold">
                    <span className="text-[10px]">|←</span>
                    <span className="bg-black/70 px-1.5 py-0.5 rounded border border-[#5adace]/40">
                      {selectedSizeConfig.label.split(' ')[1] || selectedSizeConfig.label}
                    </span>
                    <span className="text-[10px]">→|</span>
                  </div>

                  {/* Dimension Line: Left Vertical */}
                  <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between items-center text-[#5adace] font-label-mono text-[10px] font-bold">
                    <span>↑</span>
                    <span className="rotate-[-90deg] whitespace-nowrap bg-black/70 px-1 py-0.5 rounded border border-[#5adace]/40">
                      {selectedSizeConfig.label.split('×')[1] || ''}
                    </span>
                    <span>↓</span>
                  </div>

                  {/* Artwork Container according to Format */}
                  <div 
                    className={`relative transition-all duration-300 shadow-2xl flex items-center justify-center ${
                      productType === 'Framed Print'
                        ? 'p-2 bg-[#0a0a0f] border-[6px] border-black shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-sm'
                        : productType === 'Canvas Print'
                        ? 'border-2 border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.9)] rounded-sm transform scale-102'
                        : 'border border-white/20 shadow-xl'
                    }`}
                    style={{
                      width: `${selectedSizeConfig.widthPx}px`,
                      height: `${selectedSizeConfig.heightPx}px`
                    }}
                  >
                    <img 
                      src={mintRecord.generated_image_url} 
                      alt="Art Mockup" 
                      className="w-full h-full object-cover rounded-2xs"
                    />
                  </div>
                </div>
              </div>

              <p className="font-metadata text-[11px] text-[#c8c5cb]/60 text-center">
                Visual scale representation over a standard living room couch with physical dimension indicators.
              </p>
            </div>

            {/* RIGHT COLUMN: Product Config & Shipping Form */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 w-full flex flex-col gap-4">
              
              <div className="flex items-center gap-2 text-[#5adace] font-label-mono text-xs uppercase tracking-wider font-bold">
                <ShoppingBag className="w-4 h-4" />
                Printful Fine Art Order
              </div>

              <h2 className="font-display-lg text-xl sm:text-2xl font-bold text-white leading-tight">
                Physical Print of "{mintRecord.art_title}"
              </h2>

              {/* Product Format Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider">
                  1. Select Material Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Poster Print', 'Canvas Print', 'Framed Print'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProductType(type)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        productType === type
                          ? 'bg-[#5adace]/15 border-[#5adace] text-white'
                          : 'bg-[#0a0a0f] border-white/10 text-[#c8c5cb] hover:bg-[#13131b]'
                      }`}
                    >
                      <span className="font-headline-md text-[11px] font-bold block">{type}</span>
                      <span className="font-label-mono text-[10px] text-[#5adace] mt-1">
                        {type === 'Poster Print' ? 'Satin Paper' : type === 'Canvas Print' ? 'Gallery Wrap' : 'Matte Black Frame'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Size Options (Includes A4, A3, A2, A1, etc.) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider flex items-center justify-between">
                  <span>2. Select Fine Art Sizing</span>
                  <span className="text-[10px] text-[#5adace] font-label-mono font-normal">
                    International & Inches Ratios
                  </span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPrintSize(opt.id)}
                      className={`p-2 rounded-xl border font-label-mono text-[11px] font-bold transition-all cursor-pointer text-left flex flex-col justify-between ${
                        printSize === opt.id
                          ? 'bg-[#b794f4]/20 border-[#b794f4] text-[#d4bbff] shadow-[0_0_15px_rgba(183,148,244,0.3)]'
                          : 'bg-[#0a0a0f] border-white/10 text-[#c8c5cb] hover:bg-[#13131b]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[10px] text-[#5adace] mt-0.5">
                        ${Math.round(opt.priceBase * FORMAT_MULTIPLIERS[productType])}.00 USD
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Address Inputs */}
              <div className="flex flex-col gap-2.5 pt-1 border-t border-white/10">
                <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#5adace]" /> 3. Global Shipping Address
                </label>

                <input
                  type="text"
                  required
                  placeholder="Full Recipient Name"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0a0a0f] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-[#5adace]"
                />

                <input
                  type="text"
                  required
                  placeholder="Street Address Line 1"
                  value={shipping.addressLine1}
                  onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0a0a0f] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-[#5adace]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0a0a0f] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-[#5adace]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal / Zip Code"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0a0a0f] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-[#5adace]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-[#93000a]/30 border border-[#ffb4ab]/40 rounded-lg text-xs text-[#ffb4ab] text-center font-metadata flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Total Price & Order Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-metadata text-[11px] text-[#c8c5cb]/70 block">Total Item & Fulfillment:</span>
                  <span className="font-display-lg text-xl font-bold text-[#5adace]">${totalPrice}.00 USD</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-6 bg-[#f7fafc] text-black font-label-mono text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-black animate-spin" />
                      Fulfilling with Printful...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      Submit Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
