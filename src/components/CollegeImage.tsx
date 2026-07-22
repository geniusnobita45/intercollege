import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

type CollegeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc: string;
};

export default function CollegeImage({ fallbackSrc, src, alt = '', onError, ...props }: CollegeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      loading={props.loading ?? 'lazy'}
      decoding={props.decoding ?? 'async'}
      onError={(event) => {
        onError?.(event);
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
