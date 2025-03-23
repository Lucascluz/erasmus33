import { Input } from "@heroui/input";

import {
  centerCrop,
  makeAspectCrop,
  PercentCrop,
  ReactCrop,
} from "react-image-crop";

import { useState, useRef } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
  callback: (imageFile: File) => void;
}

const ImageCropper = ({ callback }: ImageCropperProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<PercentCrop | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString();
      if (imageUrl) {
        setImgSrc(imageUrl);
      }
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: { currentTarget: { width: any; height: any } }) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthInPercent },
      ASPECT_RATIO,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const getCroppedImage = () => {
    if (!imgRef.current || !crop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

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
      pixelCrop.height,
    );

    // Garantir que a conversão do Blob seja bem-sucedida
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to create blob from canvas.");
        return;
      }

      const file = new File([blob], `profile_picture.png`, {
        type: "image/png",
      });
      callback(file);
    }, "image/png");
  };

  return (
    <>
      <Card className="mt-6 mb-6" isBlurred>
        <Input type="file" accept="image/*" onChange={onSelectFile} />
        {error && <p className="text-red-500">{error}</p>}
        {imgSrc && (
          <div className="flex flex-col items-center mt-6">
            <ReactCrop
              crop={crop}
              keepSelection
              circularCrop
              onChange={(_, percentCrop: PercentCrop) => setCrop(percentCrop)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                style={{ maxHeight: "70vh" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button className="m-4" variant="ghost" onPress={getCroppedImage}>
              Save
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};
export default ImageCropper;
