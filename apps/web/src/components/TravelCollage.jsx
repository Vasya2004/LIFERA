'use client';

// Displays up to 4 photos as a collage preview
export default function TravelCollage({ photos = [], title }) {
  const filled = [...photos, null, null, null, null].slice(0, 4);

  if (photos.length === 0) {
    return (
      <div className="absolute inset-0 bg-secondary flex items-center justify-center">
        <span className="font-bebas text-5xl text-muted-foreground opacity-30">
          {title?.[0] || '?'}
        </span>
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <img src={photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
    );
  }

  if (photos.length === 2) {
    return (
      <div className="absolute inset-0 flex">
        {photos.map((p, i) => (
          <img key={i} src={p} alt="" className="w-1/2 h-full object-cover" />
        ))}
      </div>
    );
  }

  if (photos.length === 3) {
    return (
      <div className="absolute inset-0 flex">
        <img src={photos[0]} alt="" className="w-1/2 h-full object-cover" />
        <div className="w-1/2 flex flex-col">
          <img src={photos[1]} alt="" className="h-1/2 w-full object-cover" />
          <img src={photos[2]} alt="" className="h-1/2 w-full object-cover" />
        </div>
      </div>
    );
  }

  // 4 photos — 2x2 grid
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
      {filled.map((p, i) =>
        p ? (
          <img key={i} src={p} alt="" className="w-full h-full object-cover" />
        ) : (
          <div key={i} className="bg-secondary" />
        )
      )}
    </div>
  );
}
