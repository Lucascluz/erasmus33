'use client';

import { useEffect, useState } from 'react';
import { signUpAction } from '@/app/(auth-pages)/sign-up/actions';
import { SubmitButton } from '@/components/submit-button';
import ImageCropper from '@/components/ui/image-cropper';
import {
	Card,
	CardFooter,
	CardHeader,
	Image,
	Input,
	Select,
	SelectItem,
} from '@heroui/react';
import { SignUpFormData } from '@/interfaces/signup';
import { placeHolders } from '@/assets/images';

export default function SignUpForm() {
	const [formData, setFormData] = useState<SignUpFormData>({
		email: '',
		password: '',
		first_name: '',
		last_name: '',
		phone_number: '',
		country: '',
		preferred_language: 'en',
		role: 'user',
		profile_picture: null,
	});
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (profilePicture) {
			const objectUrl = URL.createObjectURL(profilePicture);
			setProfilePictureUrl(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [profilePicture]);

	useEffect(() => {
		// Show the error as user types if passwords don't match
		if (confirmPassword && formData.password !== confirmPassword) {
			setPasswordError('Passwords do not match.');
		} else {
			setPasswordError('');
		}
	}, [formData.password, confirmPassword]);

	const handleImage = (file: File) => {
		setFormData((prev) => ({ ...prev, profile_picture: file }));
		setProfilePicture(file);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData.password !== confirmPassword) {
			setPasswordError('Passwords do not match.');
			return;
		}

		const payload = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (value) payload.append(key, value);
		});

		await signUpAction(payload);
	};

	return (
		<Card className='p-6 mx-auto max-w-4xl w-full'>
			<CardHeader>
				<h2 className='text-2xl font-bold'>Sign up</h2>
			</CardHeader>
			<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Card className='flex flex-col items-center justify-center'>
						<Image
							src={profilePictureUrl ?? placeHolders.profilePicture.src}
							width={200}
							className='rounded-full'
						/>
						<CardFooter>
							<ImageCropper aspectRatio='1/1' callback={handleImage} />
						</CardFooter>
					</Card>

					<div className='flex flex-col gap-4 md:col-span-2'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Input
								label='Email'
								type='email'
								name='email'
								required
								value={formData.email}
								onChange={handleChange}
							/>
							<Input
								label='Phone Number'
								type='text'
								name='phone_number'
								value={formData.phone_number}
								onChange={handleChange}
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Input
								label='Password'
								type='password'
								name='password'
								required
								minLength={6}
								value={formData.password}
								onChange={handleChange}
							/>
							<div>
								<Input
									label='Confirm Password'
									type='password'
									required
									minLength={6}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								{passwordError && (
									<p className='text-sm text-danger mt-1'>
										{passwordError}
									</p>
								)}
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Input
								label='First Name'
								type='text'
								name='first_name'
								value={formData.first_name}
								onChange={handleChange}
							/>
							<Input
								label='Last Name'
								type='text'
								name='last_name'
								value={formData.last_name}
								onChange={handleChange}
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Input
								label='Country'
								type='text'
								name='country'
								value={formData.country}
								onChange={handleChange}
							/>
							<Select
								label='Preferred Language'
								name='preferred_language'
								value={formData.preferred_language}
								onChange={handleChange}>
								<SelectItem key='pt' text-value='pt'>
									Portuguese
								</SelectItem>
								<SelectItem key='en' text-value='en'>
									English
								</SelectItem>
							</Select>
						</div>
					</div>
				</div>

				<SubmitButton>Sign up</SubmitButton>
			</form>
		</Card>
	);
}
