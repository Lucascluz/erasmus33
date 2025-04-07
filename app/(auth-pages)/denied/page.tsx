'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { Button, Card } from '@heroui/react';

const DeniedPage: React.FC = () => {
	const handleGoHome = () => {
		redirect('/');
	};

	return (
		<Card className='flex flex-col items-center justify-center  p-6 text-center'>
			<h1>You don't have permission to access this page</h1>
			<Button className='mt-4' onPress={handleGoHome}>
				Go to Homepage
			</Button>
			<p style={{ marginTop: '20px' }}>
				If you believe this is a mistake, please contact support.
			</p>
		</Card>
	);
};

export default DeniedPage;
