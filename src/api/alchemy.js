const ALCHEMY_API_KEY = "demo";

const PROJECT_DICTIONARY = {
  "arace iba": "0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9",
  "arciba": "0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9",
  "dwm": "0x90192d63e476b7ce061c0dbbad10fde95c5e1514", // Usando Franciane temporariamente como mockup se necessário, mas vou usar outro se achar.
  "owbn": "0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b", // Usando Owie
  "bftiii": "0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef",
  "bf terra": "0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef",
  "apnkaa": "0x21031505ef6eda4c078da90bbc9fd5e4b1d120ff" 
};

export const fetchB4NFT = async (projectName) => {
  const normalizedName = projectName.toLowerCase().trim();
  const address = PROJECT_DICTIONARY[normalizedName];

  if (!address) {
    return null; // Não encontrou mapeamento
  }

  try {
    const url = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}/getNFTsForCollection?contractAddress=${address}&withMetadata=true&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.nfts && data.nfts.length > 0) {
      const nft = data.nfts[0];
      const imageUrl = nft.media?.[0]?.gateway || nft.metadata?.image || null;
      return {
        contractAddress: address,
        imageUrl: imageUrl,
        title: nft.title || nft.metadata?.name || 'Certificado B4'
      };
    }
    
    return { contractAddress: address, imageUrl: null, title: 'NFT não encontrado' };
  } catch (error) {
    console.error("Erro ao buscar NFT da Alchemy:", error);
    return null;
  }
};
