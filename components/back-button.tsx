'use client'

import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {

    const router = useRouter();

    return (
        <Button className='justify-start' variant='light' onPress={() => router.back()}>
            <ArrowLeft className='mr-2' size={36} />
            <h1 className="text-xl">Voltar</h1>
        </Button>
    )
}