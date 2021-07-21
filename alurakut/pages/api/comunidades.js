import { SiteClient  } from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST') {
        const TOKEN = '5ff3ec10bf666c60b235fb2f33dcd2';

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "981026",
            ...request.body
        })

        response.json({
            dados: 'Algum dado',
            registroCriado: registroCriado,
        });

        return;
    }

    response.status(404).json({
        message: "Nada no GET, mas no post tem!"
    })
}