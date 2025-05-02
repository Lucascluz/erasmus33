'use client';

import { useState } from 'react';
import { Image } from '@heroui/image';

interface RoomGalleryProps {
	images: string[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
	const [selected, setSelected] = useState(images[0]);

	return (
		<div>
			<div className='w-full mx-auto aspect-video relative shadow-md'>
				<Image
					src={selected}
					alt='Imagem do quarto'
					className='object-cover w-full h-full'
					width={1920}
				/>
			</div>

			<div className='mt-2 gap-2 justify-start flex flex-wrap'>
				{images.map((img, index) => (
					<Image
						isZoomed
						key={index}
						src={img}
						alt={`Imagem ${index + 1}`}
						width={176}
						className='cursor-pointer'
						onClick={() => setSelected(img)}
					/>
				))}
			</div>
		</div>
	);
}
