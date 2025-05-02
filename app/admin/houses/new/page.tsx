import BackButton from '@/components/back-button';
import HouseFormNew from '@/components/houses/house-form-new';
import HouseForm from '@/components/houses/house-form-new';

export default async function HouseNewPage() {
	return (
		<div className='max-w-3xl mx-auto p-6'>
			<div className='flex items-center justify-between p-4'>
				<BackButton />
				<h1 className='text-3xl font-bold'>New House</h1>
			</div>
			<HouseFormNew />
		</div>
	);
}
