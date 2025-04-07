import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/sign-in');
	}

	return (
		<section className='flex flex-col items-center justify-center'>
			<h1 className='text-6xl text-center py-10'>Welcome to Guarda!</h1>
			<p className='text-2xl text-center px-30 py-10'>
				Erasmus 33 already has a decade of experience in housing students from all
				over the world, under the Erasmus + Programme. We are the best option for
				those looking for an incredible stay and experience in the city of Guarda!
			</p>
		</section>
	);
}
