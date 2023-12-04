const fetch = require('node-fetch');
const fs = require('fs');


const FindAPI1 = 'http://localhost:5000/getbyID/';
const FindAPI2 = 'http://localhost:5000/getbyVNo/';
let qrCodeImage = '';

async function create(req, res) {
  const name = req.query.name;
  const phone = req.query.phone;
  const vehicalNo = req.query.vehicalNo;

  const apiUrl = 'http://localhost:5000/insert';
  const data = {
    name: name,
    phone: phone,
    vahicalNO: vehicalNo,
  };

  const queryString = new URLSearchParams(data).toString();
  const fullUrl = `${apiUrl}?${queryString}`;
  console.log(fullUrl);

  try {
    const response = await fetch(FindAPI2 + vehicalNo);
    const data = await response.json();
    if (response.ok) {
      if (vehicalNo === undefined) {
        res.sendFile(__dirname + '/pages/index.html');
      } else {
        await fetch(fullUrl);
        res.redirect('/qr/' + vehicalNo);
      }
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

async function generateQR(req, res) {
  const vahicalId = req.params.vahicalid;
  try {
    const response = await fetch(FindAPI2 + vahicalId,);
    const data = await response.json();
    // console.log(response);
    let id = data[0].id;
    if (response.ok) {
      qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        'http://localhost:5000/find/' + id
      )}`;
      let a = data[0].vahicalNO;

      if (a === vahicalId) {
        qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          'http://localhost:5000/find/' + id
        )}`;
      }
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexContent = fs.readFileSync('pages/QR.html', 'utf8');
    // Replace [QR_CODE_DATA_URL] with the actual data URL
    const updatedIndexContent = indexContent.replace(
      '[QR_CODE_DATA_URL]',
      qrCodeImage
    );
    res.end(updatedIndexContent);
  } catch (error) {
    // Handle errors
    console.error('Fetch error:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

async function findUser(req, res) {
  const userId = req.params.id;
  const lastDValue = req.query.lastD;
  try {
    const response = await fetch(FindAPI1 + userId, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_secret_key', // Include your API key in the headers
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const phone = data[0].phone;
    const vahicalN = data[0].vahicalNO;

    const first = vahicalN.slice(0, 6);
    const last = vahicalN.slice(-4);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexContent = fs.readFileSync('pages/find.html', 'utf8');

    let updatedIndexContent;
    updatedIndexContent = indexContent
      // .replace('<!-- REPLACE_PHONE -->', phone)
      .replace('<!-- REPLACE_VEHICLE -->', first);
    if (last == lastDValue) {
      updatedIndexContent = indexContent
        // .replace('<!-- REPLACE_PHONE -->', phone)
        .replace('<!-- REPLACE_VEHICLE -->', first + last);
    }
    res.end(updatedIndexContent);
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

module.exports = { create, generateQR, findUser };
