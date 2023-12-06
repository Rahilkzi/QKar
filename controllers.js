const fetch = require('node-fetch');
const fs = require('fs');

const FindAPI = 'http://localhost:5000/get/';

// Define route for the initial HTML page

async function create(req, res) {
  res.sendFile(__dirname + '/pages/index.html');
}

async function submit(req, res) {
  const { name, phone, vehicalNo } = req.body;
  const apiUrl = 'http://localhost:5000/insert';
  try {
    const postResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        vahicalNO: vehicalNo,
      }),
    });

    // Check if the POST request was successful
    if (postResponse.ok) {
      // Handle success, e.g., redirect or send a response
      res.redirect('/qr/' + vehicalNo);
    } else {
      // Handle the error in the POST request
      console.error('POST request failed:', postResponse.status);
      // console.error('Response text:', await postResponse.text());
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

async function generateQR(req, res) {
  let qrCodeImage = '';
  const vahicalId = req.params.vahicalid;
  try {
    const response = await fetch(FindAPI + 'Vno/' + vahicalId);
    const data = await response.json();
    if (response.ok) {
      const id = data[0]?.id;
      const foundVehicleNo = data[0]?.vahicalNO;
      if (foundVehicleNo === vahicalId) {
        qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          'http://localhost:5000/find/' + id
        )}`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const indexContent = fs.readFileSync('pages/QR.html', 'utf8');
        // Replace [QR_CODE_DATA_URL] with the actual data URL
        const updatedIndexContent = indexContent.replace(
          '[QR_CODE_DATA_URL]',
          qrCodeImage
        );
        res.end(updatedIndexContent);
      } else {
        res.status(404).send('Not Found');
      }
    }
  } catch (error) {
    // Handle errors
    console.error('Fetch error:', error.message);
    res.status(500).send('Internal Server Error');
  }
}

async function Test(req, res) {
  const userId = 'Vno/' + req.params.id;
  console.log(userId);
  a = FindAPI + userId;
  console.log(a);
  const response = await fetch(FindAPI + userId);
  // console.log(response);
  const data = await response.json();
  console.log(data);
}

async function findUser(req, res) {
  const userId = req.params.id;
  const lastDValue = req.query.lastD;
  try {
    const response = await fetch(FindAPI + 'id/' + userId, {
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

module.exports = { create, generateQR, findUser, Test, submit };
