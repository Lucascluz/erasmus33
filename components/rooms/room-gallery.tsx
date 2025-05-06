'use client';

import { useState } from 'react';
import { Image } from '@heroui/image';
import { Card, ScrollShadow } from '@heroui/react';

interface RoomGalleryProps {
	images: string[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
	const [selected, setSelected] = useState(images[0]);

	return (
		<Card className='flex flex-col gap-4 p-4 mx-auto'>
			<div className='w-full mx-auto aspect-video relative shadow-md'>
				<Image
					src={selected}
					alt='Imagem do quarto'
					className='object-cover w-full h-full'
					width={1920}
				/>
			</div>

			<Card className='p-2'>
				<div className='flex gap-2'>
					{images.map((img, index) => (
						<Image
							isZoomed
							key={index}
							src={img}
							alt={`Imagem ${index + 1}`}
							sizes='(100vw - 2rem) 100vw'
							width={1920}
							className='cursor-pointer'
							onClick={() => setSelected(img)}
						/>
					))}
				</div>
			</Card>
		</Card>
	);
}
