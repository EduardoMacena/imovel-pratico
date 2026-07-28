import { prisma } from "@imovel-pratico/database";

export async function buscarMunicipioPrincipalAtivoDoCliente(
	clienteId: string
) {
	const vinculo = await prisma.clienteMunicipio.findFirst({
		where: {
			clienteId,
			ativo: true,
			municipio: {
				status: "ATIVO",
			},
		},
		orderBy: [
			{
				principal: "desc",
			},
			{
				createdAt: "asc",
			},
		],
		select: {
			municipio: {
				select: {
					id: true,
					codigoIbge: true,
					nome: true,
					uf: true,
					status: true,
				},
			},
		},
	});

	if (!vinculo) {
		throw new Error("Cliente sem município ativo configurado");
	}

	return vinculo.municipio;
}
