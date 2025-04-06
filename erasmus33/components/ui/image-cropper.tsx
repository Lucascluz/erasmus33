import { Input } from '@heroui/input';
import {
	centerCrop,
	makeAspectCrop,
	PercentCrop,
	ReactCrop,
} from 'react-image-crop';
import { useState, useRef, ChangeEvent, JSX } from 'react';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import 'react-image-crop/dist/ReactCrop.css'; // Ensure this is imported

const MIN_DIMENSION = 150;

interface ImageCropperProps {
	callback: (imageFile: File) => void;
	isCircular?: boolean;
	aspectRatio?: '1/1' | '16/9';
}

const ImageCropper = ({
	callback,
	isCircular,
	aspectRatio,
}: ImageCropperProps): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imgSrc, setImgSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState<PercentCrop | undefined>(undefined);
	const [ASPECT_RATIO] = useState(
		aspectRatio === '1/1' ? 1 : aspectRatio === '16/9' ? 16 / 9 : 1
	);

	const imgRef = useRef<HTMLImageElement | null>(null);

	const onSelectFile = (e: ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result) {
				setImgSrc(reader.result.toString());
			}
		};
		reader.readAsDataURL(file);
	};

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>): void => {
		const { width, height } = e.currentTarget;
		const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

		const crop = makeAspectCrop(
			{ unit: '%', width: cropWidthInPercent },
			ASPECT_RATIO,
			width,
			height
		);
		setCrop(centerCrop(crop, width, height));
	};

	const getCroppedImage = (): void => {
		if (!imgRef.current || !crop) return;

		const image = imgRef.current;
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		const pixelCrop = {
			x: (crop.x / 100) * image.width * scaleX,
			y: (crop.y / 100) * image.height * scaleY,
			width: (crop.width / 100) * image.width * scaleX,
			height: (crop.height / 100) * image.height * scaleY,
		};

		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		);

		canvas.toBlob((blob) => {
			if (!blob) {
				console.error('Failed to create blob from canvas.');
				return;
			}

			const file = new File([blob], 'picture.png', {
				type: 'image/png',
			});
			callback(file);

			// Clear the image and reset the input
			setImgSrc(null);
			setCrop(undefined);
			setIsModalOpen(false);
		}, 'image/png');
	};

	return (
		<>
			<Button
				className='text-tiny text-white bg-black/20'
				color='default'
				radius='lg'
				size='sm'
				variant='flat'
				onPress={() => setIsModalOpen(true)}>
				<ArrowUpIcon />
			</Button>
			<Modal isOpen={isModalOpen} size='lg' onClose={() => setIsModalOpen(false)}>
				<ModalContent>
					<ModalBody>
						<Card isBlurred className='mt-6 mb-6'>
							<Input accept='image/*' type='file' onChange={onSelectFile} />
							{imgSrc && (
								<div className='flex flex-col items-center mt-6'>
									<ReactCrop
										circularCrop={isCircular}
										keepSelection
										aspect={ASPECT_RATIO}
										crop={crop}
										minWidth={MIN_DIMENSION}
										onChange={(_, percentCrop: PercentCrop) => setCrop(percentCrop)}>
										<img
											ref={imgRef}
											alt='Upload'
											src={imgSrc}
											style={{ maxHeight: '50vh' }}
											onLoad={onImageLoad}
										/>
									</ReactCrop>
									<Button className='m-4' variant='ghost' onPress={getCroppedImage}>
										Save
									</Button>
								</div>
							)}
						</Card>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ImageCropper;
