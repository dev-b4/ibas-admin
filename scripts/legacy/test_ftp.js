const ftp = require("basic-ftp");
async function run() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "192.185.216.231",
      user: "ibas@b4.capital",
      password: "###", 
      secure: false
    });
    await client.cd("v2/assets");
    await client.remove("index-BnydI4Rx.css").catch(e => console.log("Did not exist"));
  } catch(err) {
    console.log(err);
  }
  client.close();
}
run();
