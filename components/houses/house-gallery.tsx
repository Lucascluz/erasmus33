'use client';

import { useState } from 'react';
import { Image } from '@heroui/image';
import { Card, ScrollShadow } from '@heroui/react';

interface HouseGalleryProps {
  images: string[];
}

export default function HouseGallery({ images }: HouseGalleryProps) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <Card className='flex flex-col gap-2 p-2'>
      <div className='w-full mx-auto aspect-video relative shadow-md'>
        <Image
          src={selected}
          alt='Imagem do quarto'
          className='object-cover w-full h-full'
          width={1920}
        />
      </div>

      <Card className='p-2'>
        <div className='flex justify-center gap-2'>
          {images.map((img, index) => (
            <Image
              isZoomed
              key={index}
              src={img}
              alt={`Imagem ${index + 1}`}
              sizes='(100vw - 2rem) 100vw'
              height={100}
              className='cursor-pointer'
              onClick={() => setSelected(img)}
            />
          ))}
        </div>
      </Card>
    </Card>
  );
}
