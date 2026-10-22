import { useState, type ImgHTMLAttributes } from 'react';

const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="#f5ecd9"/><path d="M28 82V38h64v44H28zm4-4 19-20 13 13 9-9 15 16M72 48h.1" fill="none" stroke="#79604c" stroke-width="4" stroke-linejoin="round"/></svg>');

function convertImageUrl(url?: string) {
  if (!url) return FALLBACK;
  const match = url.match(/^https?:\/\/maimai\.sega\.jp\/img\/(music|category|version|type|diff)\/([^?#]+)\.png(?:[?#].*)?$/);
  if (!match) return url;
  const folder = match[1] === 'music' ? 'cover-m' : match[1];
  return `https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/${folder}/${match[2]}`;
}

type Props = ImgHTMLAttributes<HTMLImageElement>;

function ImageForSource({ src, alt, style = {}, className = '', onError, onLoad, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(!src);
  return <img {...props} src={failed ? FALLBACK : convertImageUrl(src)} alt={alt}
    style={{ display: 'block', ...(!loaded ? { backgroundImage: `url("${FALLBACK}")`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}), ...style }} className={className}
    onLoad={event => { setLoaded(true); onLoad?.(event); }}
    onError={event => { setFailed(true); onError?.(event); }} />;
}

export default function SafeImage(props: Props) {
  // A new source resets failures. Object URLs belong to their caller.
  return <ImageForSource key={props.src} {...props} />;
}
