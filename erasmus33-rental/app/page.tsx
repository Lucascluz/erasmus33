import { Image } from '@heroui/image';

export default function Home() {
	return (
		<section className='flex flex-col items-center justify-center'>
			<h1 className='text-8xl text-center py-10'>Welcome to Guarda!</h1>
			<Image
				isBlurred
				radius='lg'
				width='100%'
				src='https://center-portugal.transforms.svdcdn.com/production/images/Guarda_2023-07-24-133040_zerj.jpg?w=1600&h=600&q=100&auto=format&fit=crop&dm=1691594136&s=1d359e62ba05d42e9b9e3c3213f3f037'></Image>
			<p className='text-2xl text-center px-30 py-10'>
				Erasmus 33 already has a decade of experience in housing students from all
				over the world, under the Erasmus + Programme. We are the best option for
				those looking for an incredible stay and experience in the city of Guarda!
			</p>
		</section>
	);
}
