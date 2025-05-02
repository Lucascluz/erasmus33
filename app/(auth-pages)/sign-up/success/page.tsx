import { Card, CardHeader } from "@heroui/react";

export default function SignUpSuccessPage() {
    return (
        <Card className='flex flex-col gap-4 p-4 items-center justify-center'>
            <CardHeader className='flex flex-col items-center justify-center text-center'>
                <h1 className='text-3xl font-bold'>Email de confirmação enviado!</h1>
            </CardHeader>
            <p className='text-muted-foreground'>
                Verifique sua caixa de entrada e clique no link para confirmar seu email.
            </p>
            <p className='text-muted-foreground'>
                Caso não tenha recebido o email, verifique sua caixa de spam ou tente
                novamente.
            </p>
        </Card>
    );
}