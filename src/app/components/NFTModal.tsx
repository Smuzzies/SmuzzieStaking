'use client'

interface NFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    name: string;
    image: string;
    rank?: number;
  };
}

export function NFTModal({ isOpen, onClose, nft }: NFTModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-dark-card rounded-xl overflow-hidden max-w-2xl w-full shadow-2xl border border-primary/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={nft.image}
            alt={nft.name}
            className="w-full object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
          {nft.rank && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400">Rank:</span>
              <span className="text-primary font-semibold">#{nft.rank}</span>
              <span className="text-gray-600">/ 4025</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 