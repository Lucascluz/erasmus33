import { Card, Modal, ModalContent, ModalFooter, Button, Image } from "@heroui/react";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const FormImagesModal = ({ images, onRemoveImage }: { images: string[], onRemoveImage: (url: string) => void }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className='grid grid-cols-4 gap-4'>
            {images.map((image, index) => (
                <Card key={index} className='w-full overflow-hidden items-end' isPressable onPress={() => {
                    console.log(image);
                    setSelectedImage(image);
                    setIsOpen(true);
                }}>
                    <Image
                        src={image}
                        alt={`Room Image ${index + 1}`}
                        className='w-full object-cover rounded-md'
                        isZoomed
                    />
                </Card>
            ))}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size='xl' className='overflow-hidden'>
                <ModalContent className='max-w-2xl'>

                    <Image
                        src={selectedImage!}
                        alt='Selected Room Image'
                        className='w-full object-cover rounded-md'
                    />

                    <ModalFooter className='flex justify-between'>
                        <Button color='primary' onPress={() => setIsOpen(false)} className='mr-2' startContent={<ArrowLeftIcon className='h-5 w-5' />}>
                            Back
                        </Button>

                        <Button color='danger' startContent={<TrashIcon className='h-5 w-5' />} className='mb-2' isLoading={false} disabled={false}
                            onPress={() => {
                                if (selectedImage) {
                                    onRemoveImage(selectedImage);
                                }
                                setIsOpen(false);
                            }}>
                            Delete Image
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    )
}
