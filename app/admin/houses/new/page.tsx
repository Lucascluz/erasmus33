import BackButton from '@/components/admin/back-button';
import HouseForm from '@/components/houses/house-form';

export default async function HouseNewPage() {
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='flex items-center justify-between p-4'>
				<BackButton />
				<h1 className='text-3xl font-bold'>New House</h1>
			</div>
			<HouseForm mode={'create'} />
		</div>
	);
}
