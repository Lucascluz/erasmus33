import { Image } from '@heroui/image';

export default function Home() {
	return (
		<section className='flex flex-col items-center justify-center'>
			<h1 className='text-8xl text-center py-10'>Welcome to Guarda!</h1>
			<Image
				isBlurred
				radius='lg'
				width='100%'
				src='https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/assets//Captura%20de%20tela_19-3-2025_172851_center-portugal.transforms.svdcdn.com.jpeg'
			/>
			<p className='text-2xl text-center px-30 py-10'>
				Erasmus 33 already has a decade of experience in housing students from all
				over the world, under the Erasmus + Programme. We are the best option for
				those looking for an incredible stay and experience in the city of Guarda!
			</p>
		</section>
	);
}
