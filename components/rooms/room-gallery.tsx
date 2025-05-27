'use client';

import { useState } from 'react';
import { Card } from '@heroui/react';

interface RoomGalleryProps {
	images: string[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
	const [selected, setSelected] = useState(images[0]);

	return (
		<Card className="flex flex-col gap-4 p-4 mx-auto max-w-7xl">
			{/* Main Image */}
			<div className="w-full aspect-video relative bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-md">
				<img
					src={selected}
					alt="Imagem do quarto"
					className="max-w-full max-h-full object-contain"
				/>
			</div>

			{/* Thumbnail Gallery */}
			<Card className="p-2 overflow-x-auto">
				<div className="flex gap-3 sm:gap-4">
					{images.map((img, index) => (
						<div
							key={index}
							onClick={() => setSelected(img)}
							className={`aspect-video w-32 sm:w-40 md:w-48 bg-black rounded-md overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-all ${
								selected === img ? 'border-primary' : 'border-transparent'
							}`}
						>
							<img
								src={img}
								alt={`Imagem ${index + 1}`}
								className="max-w-full max-h-full object-contain"
							/>
						</div>
					))}
				</div>
			</Card>
		</Card>
	);
}
