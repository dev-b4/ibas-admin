import * as ftp from "basic-ftp";

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Conectando ao FTP...");
        await client.access({
            host: "ftp.b4.capital",
            user: "ibas@b4.capital",
            password: "sdhbsbhdSBDBSD234234@#$#!@#$12342",
            secure: false
        });
        
        console.log("Conectado! Garantindo diretório v2 e subindo arquivos do /dist...");
        await client.ensureDir("v2");
        await client.uploadFromDir("dist");
        
        console.log("Deploy concluído com sucesso!");
    }
    catch(err) {
        console.error("Erro no Deploy:", err);
    }
    client.close();
}

deploy();
