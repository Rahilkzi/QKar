const fetch = require('node-fetch');
const fs = require('fs');

const FindAPI1 = 'http://localhost:3000/getbyID/';
const FindAPI2 = 'http://localhost:3000/getbyVNo/';
let qrCodeImage = '';

const fetchAndHandleResponse = async (url, successCallback, errorCallback) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    successCallback(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
    errorCallback(error);
  }
};

async function create(req, res) {
  const name = req.query.name;
  const phone = req.query.phone;
  const vehicalNo = req.query.vehicalNo;

  const apiUrl = 'http://localhost:3000/insert';
  const data = {
    name: name,
    phone: phone,
    vahicalNO: vehicalNo,
  };

  const queryString = new URLSearchParams(data).toString();
  const fullUrl = `${apiUrl}?${queryString}`;
  console.log(fullUrl);

  const successCallback = async (data) => {
    if (vehicalNo === undefined) {
      res.sendFile(__dirname + '/pages/index.html');
    } else {
      await fetch(fullUrl);
      res.redirect('/qr/' + vehicalNo);
    }
  };

  fetchAndHandleResponse(FindAPI2 + vehicalNo, successCallback, (error) => {
    res.status(500).send('Internal Server Error');
  });
}

async function generateQR(req, res) {
  const vahicalId = req.params.vahicalid;

  const successCallback = async (data) => {
    let id = data[0].id;
    qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      'http://localhost:5000/find/' + id
    )}`;
    let a = data[0].vahicalNO;

    if (a === vahicalId) {
      qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        'http://localhost:5000/find/' + id
      )}`;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexContent = fs.readFileSync('pages/QR.html', 'utf8');
    const updatedIndexContent = indexContent.replace(
      '[QR_CODE_DATA_URL]',
      qrCodeImage
    );
    res.end(updatedIndexContent);
  };

  fetchAndHandleResponse(FindAPI2 + vahicalId, successCallback, (error) => {
    res.status(500).send('Internal Server Error');
  });
}

async function findUser(req, res) {
  const userId = req.params.id;
  const lastDValue = req.query.lastD;

  const successCallback = async (data) => {
    const phone = data[0].phone;
    const vahicalN = data[0].vahicalNO;

    const first = vahicalN.slice(0, 6);
    const last = vahicalN.slice(-4);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexContent = fs.readFileSync('pages/find.html', 'utf8');

    let updatedIndexContent;
    updatedIndexContent = indexContent.replace(
      '<!-- REPLACE_VEHICLE -->',
      first
    );
    if (last == lastDValue) {
      updatedIndexContent = indexContent.replace(
        '<!-- REPLACE_VEHICLE -->',
        first + last
      );
    }
    res.end(updatedIndexContent);
  };

  fetchAndHandleResponse(FindAPI1 + userId, successCallback, (error) => {
    // Handle error as needed
    console.error('Fetch error:', error.message);
  });
}

module.exports = { create, generateQR, findUser };
