'use client'

import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

export default function BackButton() {
    return (
        <Button className='justify-start' variant='light' onPress={() => redirect('/admin')}>
            <ArrowLeft className='mr-2' size={36} />
            <h1 className="text-xl">Voltar</h1>
        </Button>
    )
}