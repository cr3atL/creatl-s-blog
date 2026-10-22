import { useState } from 'react';

interface Props { src?: string | null; className?: string }

export default function SongCover({ src, className = '' }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <div className={`song-cover ${className}`}>
      {src && src !== failedSource ? (
        <img src={src} alt="" width={320} height={320} loading="lazy"
          onError={() => setFailedSource(src)} />
      ) : <span>无封面</span>}
    </div>
  );
}
