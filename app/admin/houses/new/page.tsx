import HouseForm from '@/components/houses/house-form';

export default async function NewHousePage() {
	return (
		<div className='max-w-3xl mx-auto p-6'>
			<h1 className='text-3xl font-bold'>Create New House</h1>
			<HouseForm />{' '}
		</div>
	);
}
