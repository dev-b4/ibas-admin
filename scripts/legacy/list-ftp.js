import * as ftp from "basic-ftp";

async function list() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp.b4.capital",
            user: "ibas@b4.capital",
            password: "sdhbdsbhSDBSD23423!@#$12323",
            secure: false
        });
        const list = await client.list();
        console.log("Arquivos no FTP root:");
        for (const f of list) {
            console.log(f.name, f.isDirectory ? "(DIR)" : "");
        }
    }
    catch(err) {
        console.error(err);
    }
    client.close();
}

list();
