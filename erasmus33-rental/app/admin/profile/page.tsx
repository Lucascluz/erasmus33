'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@/interfaces/user';
import {
	Button,
	CardFooter,
	Image,
	Input,
	Modal,
	Card,
	ModalBody,
	ModalContent,
} from '@heroui/react';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CameraIcon,
} from '@heroicons/react/24/solid';

import ImageCropper from '@/components/image-cropper';
import 'react-image-crop/dist/ReactCrop.css';

const fallbackPfp =
	'https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/profile_pictures/assets/user-placeholder.png';

export default function ProfilePage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const [userBackup, setUserBackup] = useState<User | null>(null);
	const [pfpUrl, setPfpUrl] = useState<string | null>(null);
	const [pfpFile, setPfpFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const { data: session, error: sessionError } =
				await supabase.auth.getSession();
			if (sessionError || !session.session) {
				router.push('/auth/login');
				return;
			}
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('id', session.session.user.id)
				.single();
			if (error) {
				console.error('Error fetching user:', error);
			} else {
				console.log('User:', data);
				setUser(data);
				setUserBackup(user);
			}
			setLoading(false);
			setPfpUrl(data.profile_picture);
		};
		fetchUser();
	}, [router]);

	async function updateUi(file: File) {
		if (!user || user == userBackup) {
			console.log('User not found or no changes made');
			return;
		}
		setIsModalOpen(false);

		// Create a temporary URL for immediate UI update
		const tempUrl = URL.createObjectURL(file);
		console.log('Create a temporary URL for immediate UI update', tempUrl);

		// Optimistically update UI
		console.log('Optimistically update UI');
		setPfpUrl(tempUrl);
		setPfpFile(file);
	}

	async function updateUserData(e: React.FormEvent) {
		e.preventDefault();
		if (!user) return;
		setLoading(true);

		// Upload profile picture
		if (pfpFile) {
			const { error: uplError } = await supabase.storage
				.from('profile_pictures')
				.upload(`public/${user.id}.png`, pfpFile, {
					upsert: true,
					contentType: pfpFile.type || 'image/png', // Usa o tipo real do arquivo
				});
			if (uplError) {
				console.error('Error uploading profile picture:', uplError.message);
			} else {
				if (!pfpFile.type.startsWith('image/')) {
					console.error('Invalid file type:', pfpFile.type);
					return;
				}
				console.log('Profile picture uploaded successfully');
				// Retrieve new profile picture URL
				const { data } = await supabase.storage
					.from('profile_pictures')
					.getPublicUrl(`public/${user.id}.png`);
				if (!data) {
					console.error('Error getting profile picture URL');
				} else {
					setUser({ ...user, profile_picture: data.publicUrl });
					console.log('Profile picture URL:', user.profile_picture);
				}
			}

			// Update user data
			const { error: updError } = await supabase
				.from('users')
				.update(user)
				.eq('id', user.id);
			if (updError) console.error('Error updating user:', updError.message);
			else console.log('User updated successfully');
			setLoading(false);
		}
	}

	function handleSignOut() {
		supabase.auth.signOut();
		setUser(null);
		router.push('/auth/login');
	}

	if (loading) return <div className='text-center p-4'>Loading...</div>;
	if (!user) return <div className='text-center p-4'>User not found.</div>;

	return (
		<div className='container mx-auto py-6'>
			<Card className='p-4'>
				<form onSubmit={updateUserData} className='space-y-4'>
					<div className='grid grid-cols-6 gap-4 justify-between align-center'>
						<div className='col-span-2 flex items-center justify-center'>
							<Card
								isFooterBlurred
								className='flex flex-col items-center border-none w-full'>
								<Image
									removeWrapper
									alt='Card example background'
									className='object-cover '
									src={pfpUrl || fallbackPfp}
									fallbackSrc={fallbackPfp}
								/>
								<CardFooter className='flex justify-between w-full'>
									<Button
										about='Upload new Profile Picture'
										onPress={() => {
											setIsModalOpen(isModalOpen ? false : true);
										}}>
										<ArrowUpIcon />
									</Button>
									<Modal
										isOpen={isModalOpen}
										onClose={() => setIsModalOpen(false)}
										size='lg'>
										<ModalContent>
											<ModalBody>
												<ImageCropper callback={updateUi} />
											</ModalBody>
										</ModalContent>
									</Modal>
								</CardFooter>
							</Card>
						</div>
						<div className='col-span-4'>
							<div className='gap-4'>
								<p className='m-2'>Personal Information</p>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										label='First Name'
										type='text'
										value={user.first_name ?? ''}
										onChange={(e) => setUser({ ...user, first_name: e.target.value })}
									/>
									<Input
										label='Last Name'
										type='text'
										value={user.last_name ?? ''}
										onChange={(e) => setUser({ ...user, last_name: e.target.value })}
										maxLength={5}
									/>
								</div>
								<p className='m-2'>International Information</p>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										label='Nationality'
										type='text'
										value={user.nationality ?? ''}
										onChange={(e) => setUser({ ...user, nationality: e.target.value })}
									/>
									<Input
										label='Preferred Language'
										type='text'
										value={user.preferred_language ?? ''}
										onChange={(e) =>
											setUser({ ...user, preferred_language: e.target.value })
										}
									/>
								</div>
								<p className='m-2'>Contact Information</p>
								<div className='grid grid-cols-4 gap-4 mb-4'>
									<Input
										label='Phone Number'
										type='text'
										value={user.phone_number ?? ''}
										onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
									/>
									<Input
										label='PT Phone Number'
										type='text'
										value={user.pt_phone_number ?? ''}
										onChange={(e) =>
											setUser({ ...user, pt_phone_number: e.target.value })
										}
									/>
									<Input
										className='col-span-2'
										label='Email'
										type='email'
										value={user.email ?? ''}
										onChange={(e) => setUser({ ...user, email: e.target.value })}
									/>
								</div>
								<p className='m-2'>Renting Information</p>
								<div className='grid grid-cols-4 gap-4'>
									<Input
										label='Room Number'
										type='text'
										value={user.room_number ? user.room_number.toString() : '0'}
										onChange={(e) =>
											setUser({ ...user, room_number: parseInt(e.target.value, 10) || 0 })
										}
									/>
									<Input
										label='House Number'
										type='text'
										value={user.house_number ? user.house_number.toString() : '0'}
										onChange={(e) =>
											setUser({
												...user,
												house_number: parseInt(e.target.value, 10) || 0,
											})
										}
									/>
									<Input
										label='Arrival Date'
										type='date'
										value={user.arrival_date ? user.arrival_date.toString() : ''}
										onChange={(e) =>
											setUser({ ...user, arrival_date: new Date(e.target.value) })
										}
									/>
									<Input
										label='Departure Estimate'
										type='date'
										value={
											user.departure_estimate ? user.departure_estimate.toString() : ''
										}
										onChange={(e) =>
											setUser({ ...user, departure_estimate: new Date(e.target.value) })
										}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='flex justify-between'>
						<Button variant='solid' type='submit' color='primary'>
							Save Changes
						</Button>

						<Button variant='bordered' onPress={handleSignOut}>
							Log Out
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
