'use client';

import { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomGalleryProps {
	images: string[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	if (!images || images.length === 0) {
		return (
			<Card className="flex flex-col gap-4 p-4 mx-auto max-w-7xl">
				<div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
					<span className="text-gray-500">No images available</span>
				</div>
			</Card>
		);
	}

	return (
		<Card className="flex flex-col gap-4 p-4 mx-auto max-w-7xl">
			{/* Main Image with Navigation */}
			<div className="w-full aspect-video relative bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-md group">
				<img
					src={images[currentIndex]}
					alt={`Room image ${currentIndex + 1}`}
					className="max-w-full max-h-full object-contain"
				/>

				{/* Navigation Arrows - Only show if more than 1 image */}
				{images.length > 1 && (
					<>
						<Button
							isIconOnly
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300"
							onPress={handlePrevious}
							size="lg"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>

						<Button
							isIconOnly
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300"
							onPress={handleNext}
							size="lg"
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</>
				)}

				{/* Image Counter */}
				{images.length > 1 && (
					<div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
						{currentIndex + 1} / {images.length}
					</div>
				)}
			</div>

			{/* Dots Indicator - Optional visual indicator */}
			{images.length > 1 && (
				<div className="flex justify-center gap-2 mt-2">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
									? 'bg-primary scale-125'
									: 'bg-gray-300 hover:bg-gray-400'
								}`}
						/>
					))}
				</div>
			)}
		</Card>
	);
}
