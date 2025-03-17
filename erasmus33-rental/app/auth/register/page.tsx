'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@/interfaces/user';
import { Select, SelectItem } from '@heroui/react';
import { nationalities } from '@/lib/nationalities';
import { languages } from '@/lib/languages';
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

import ImageCropper from '@/components/imageCropper';
import 'react-image-crop/dist/ReactCrop.css';

const fallbackPfp =
	'https://gkpotoixqcjijozesfee.supabase.co/storage/v1/object/public/profile_pictures/assets/user-placeholder.png';

export default function ProfilePage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const [pfpUrl, setPfpUrl] = useState<string | null>(null);
	const [pfpFile, setPfpFile] = useState<File | null>(null);
	const [password, setPassword] = useState('');
	const [otherNationalityState, setOtherNationalityState] = useState(false);
	const [passwordMatch, setPasswordMatch] = useState(true);

	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const blankUser: User = {
		first_name: '',
		last_name: '',
		phone_number: '',
		pt_phone_number: '',
		email: '',
		profile_picture: '',
		nationality: '',
		preferred_language: '',
		role: 'user',
	};

	useEffect(() => {
		setLoading(true);
		setUser(blankUser);
		setLoading(false);
	}, [router]);

	async function updateUi(file: File) {
		if (!user) {
			console.log('User not found');
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

	async function registerUser(e: React.FormEvent) {
		e.preventDefault();
		if (!user || !passwordMatch) return;
		setLoading(true);

		// Sign up user
		const { error: signUpError } = await supabase.auth.signUp({
			email: user.email,
			password: password,
		});
		if (signUpError) {
			console.error('Error signing up:', signUpError.message);
			setLoading(false);
			return;
		}

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
			const { error: updError } = await supabase.from('users').insert(user);
			if (updError) console.error('Error inserting user:', updError.message);
			else {
				console.log('User inserted successfully');
				router.push('/');
			}
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
				<form onSubmit={registerUser} className='space-y-4'>
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
									<Button about='Take a Picture'>
										<CameraIcon />
									</Button>
									<Button about='Download Profile Picture'>
										<ArrowDownIcon />
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
								<p>Credentials</p>
								<Input
									className='col-span-2 mb-6'
									label='Email'
									type='email'
									value={user.email ?? ''}
									onChange={(e) => setUser({ ...user, email: e.target.value })}
								/>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										className='mb-6'
										label='Password'
										type='password'
										onChange={(e) => setPassword(e.target.value)}
									/>
									<Input
										className='mb-6'
										label='Confirm Password'
										type='password'
										onChange={(e) => {
											if (e.target.value === password) setPasswordMatch(true);
											else setPasswordMatch(false);
										}}
									/>
								</div>
								{passwordMatch ? null : (
									<p className='text-red-500'>Passwords do not match</p>
								)}
								<p className='m-2'>Personal Information</p>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										className='mb-6'
										label='First Name'
										type='text'
										value={user.first_name ?? ''}
										onChange={(e) => setUser({ ...user, first_name: e.target.value })}
									/>
									<Input
										className='mb-6'
										label='Last Name'
										type='text'
										value={user.last_name ?? ''}
										onChange={(e) => setUser({ ...user, last_name: e.target.value })}
									/>
								</div>
								<p className='m-2'>International Information</p>
								<div className='grid grid-cols-2 gap-4'>
									<Select className='mb-6' label='Nationality'>
										{Object.values(nationalities).map((nationality) => (
											<SelectItem
												key={nationality}
												onPress={
													nationality === 'Other'
														? () => setOtherNationalityState(true)
														: () => {
																setUser({ ...user, nationality });
																setOtherNationalityState(false);
															}
												}>
												{nationality}
											</SelectItem>
										))}
									</Select>
									{otherNationalityState ? (
										<Input
											className='mb-6'
											label='Other Nationality'
											type='text'
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setUser({ ...user, nationality: e.target.value })
											}
										/>
									) : null}
									<Select className='mb-6' label='Preferred Language'>
										{Object.values(languages).map((language) => (
											<SelectItem
												key={language}
												onPress={() => {
													setUser({ ...user, preferred_language: language });
												}}>
												{language}
											</SelectItem>
										))}
									</Select>
								</div>
								<p className='m-2'>Contact Information</p>
								<div className='grid grid-cols-2 gap-4'>
									<Input
										label='Local Phone Number'
										labelPlacement='inside'
										type='phone'
										placeholder='+XXX XXX XXX XXX'
										value={user.phone_number ?? ''}
										onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
									/>
									<Input
										label='PT Phone Number'
										labelPlacement='inside'
										type='text'
										placeholder='+351 XXX XXX XXX'
										value={user.pt_phone_number ?? ''}
										onChange={(e) =>
											setUser({ ...user, pt_phone_number: e.target.value })
										}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='flex justify-between'>
						<Button variant='solid' type='submit' color='primary'>
							Register
						</Button>

						<Button color='danger' onPress={() => router.push('/auth/login')}>
							Cancel
						</Button>

						<Button
							onPress={() => {
								console.log('User:', user);
								console.log('Password:', password);
							}}>
							Debug
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
