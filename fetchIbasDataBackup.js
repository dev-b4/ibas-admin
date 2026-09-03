      p4 = Math.floor(baseScore * 0.10); 
      p5 = Math.floor(baseScore * 0.10); 
      p6 = Math.floor(baseScore * 0.10); 
      p7 = Math.floor(baseScore * 0.10); 
      p8 = Math.floor(baseScore * 0.10); 
      p9 = Math.floor(baseScore * 0.10); 
      p10 = Math.floor(baseScore * 0.05);
      p11 = Math.floor(baseScore * 0.05);
    }

    const total = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11;

    let nivel = 'Não Avaliado';
    let stars = '';
    if (total >= 900) { nivel = 'Excelência B4'; stars = '★★★★★'; }
    else if (total >= 800) { nivel = 'Alto Nível'; stars = '★★★★☆'; }
    else if (total >= 700) { nivel = 'Em Conformidade'; stars = '★★★☆☆'; }
    else { nivel = 'Em Observação'; stars = '★★☆☆☆'; }

    return {
      total,
      nivel,
      stars,
      detalhes: {
        p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11,
        auditor: 'B4 Validação'
      }
    };
  };

  const getAcreditationForAsset = (id, baseScore) => {
    // 1. Forçando a usar o gerador simulado para não conflitar com cache antigo no navegador (localStorage)
    return generateAcreditationScore(baseScore, id);
  };

  try {
    const res = await fetch("https://exchange.b4.capital/api/v1/collections/getAllCollections");
    const data = await res.json();
    const collections = data.collections || [];

    const permittedContracts = [
      "0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9", // Arace Iba
      "0x90192d63e476b7ce061c0dbbad10fde95c5e1514", // Apoena Kaa
      "0xd69f495fd95d429954a63196d499dcfe4f3c87f5", // Tonca
      "0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef", // BF Terra I (Representará os dois)
      "0x7466eb42b5b165d8b133a7040870b2da6c060546", // Yaku
      "0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b", // Owie Bitioni
      "0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62"  // Dowedi Mitir
    ];

    const importedStr = localStorage.getItem('b4_imported_assets');
    const importedAssets = importedStr ? JSON.parse(importedStr) : [];
    const manualContracts = importedAssets.map(i => i.id);

    const allAllowed = [...permittedContracts, ...manualContracts].map(a => a.toLowerCase());
    
    const validAssets = collections
      .filter(c => c.contract_address && allAllowed.includes(c.contract_address.toLowerCase())) // Filtra apenas originais + importados
      .map(c => {
        const desc = c.description || "";
        const nichoMatch = desc.match(/Nicho\s+([^,.\n]+)/i);
        const auditorMatch = desc.match(/Valida..o\s+da\s+Metodologia:\s*([^.\n]+)/i);

        let preco = parseFloat(c.price);
        // Se a API retornar um preço absurdamente alto (ex: 1.6 milhão), sabemos que é o Volume/Supply e não o valor do Token em Dólar.
        if (isNaN(preco) || preco > 1000) {
          preco = Math.random() * 20 + 75; // Simula um preço entre $75 e $95 para não explodir o índice
        }

        const assetId = c.contract_address.toLowerCase();
        
        // Unifica o nome da BF Terra para englobar as duas áreas no mesmo token (BFTIII)
        let displayName = c.name;
        if (assetId === "0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef") {
          displayName = "BF Terra I e II";
        }

        return {
          id: assetId,
          nome: displayName,
          categoria: nichoMatch ? nichoMatch[1].trim() : 'Geral',
          preco: preco,
          auditor: auditorMatch ? auditorMatch[1].trim() : null,
          isImported: true,
          contract: c.contract_address,
          acreditacao: getAcreditationForAsset(assetId, 800)
        };
      });

    // Calcula o peso real de cada ativo dentro do IBAS (Soma = 100%)
    const baseWeight = 1 / validAssets.length;
    validAssets.forEach(asset => {
      asset.peso = baseWeight;
    });

    return {
      moedaBase: { ticker: 'B4TRII', descricao: `Pareada ao Dólar (Cotada a R$ ${realPtax})` },
      ativos: validAssets,
      ptax: realPtax, 
      fatorNormalizacao: 1.5
    };
  } catch (error) {
    console.error("Erro ao buscar dados reais da API B4:", error);
    // Retorno vazio seguro em caso de falha de rede
    return {
      moedaBase: { ticker: 'B4TRII', descricao: 'Off-line' },
      ativos: [],
      ptax: realPtax, 
      fatorNormalizacao: 1.5
