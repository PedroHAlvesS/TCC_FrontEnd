export async function fetchAddressByZipCode(zipCode) {
	const sanitizedCep = zipCode.replace(/\D/g, "");

	if (!/^[0-9]{8}$/.test(sanitizedCep)) {
		throw new Error("CEP inválido");
	}

	const response = await fetch(
		`https://viacep.com.br/ws/${sanitizedCep}/json/`,
	);

	if (!response.ok) {
		throw new Error("Erro ao consultar o CEP");
	}

	const data = await response.json();

	if (data.erro) {
		throw new Error("CEP não encontrado");
	}

	const street = data.logradouro || "";
	const neighborhood = data.bairro || "";

	if (!street && !neighborhood) {
		throw new Error("CEP não retornou rua ou bairro");
	}

	return { street, neighborhood };
}

export default { fetchAddressByZipCode };
