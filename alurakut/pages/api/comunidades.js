import { SiteClient  } from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    const TOKEN = '5ff3ec10bf666c60b235fb2f33dcd2';

    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
        itemType: "981026",
        title: "Comunidade teste",
        imageUrl: "https://github.com/CassianoJunior.png", 
        creatorslug: "CassianoJunior"
    })

    response.json({
        dados: 'Algum dado',
        registroCriado: registroCriado,
    })
}