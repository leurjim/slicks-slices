const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `<div>
        <h2>Tu pedido reciente es de ${total}</h2>
        <p>Por favor, comience a caminar, tendremos su pedido listo en los próximos 20 minutos.</p>
        <ul>
            ${order
              .map(
                (item) => `<li>
                    <img src="${item.thumbnail}" alt="${item.name}"/>
                    ${item.size} ${item.name} - ${item.price}
                </li>`
              )
              .join('')}
        </ul>
        <p>Tu total es <strong>${total}</strong> pagar al momento del recojo</p>
        <style>
                ul {
                    list-style: nome;
                }
        </style>
    </div>`;
}

// crear un transport para nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  // Revisar si tienen llenadas las honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Boop beep bop zzzzsttp adios' }),
    };
  }
  // validar la data que ingresa es correcta
  const requiredFields = ['email', 'name', 'order'];

  for (const field of requiredFields) {
    console.log(`Chequear que ${field} esta bien`);
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! You are missing the ${field} field`,
        }),
      };
    }
  }

  // asegúrese de que realmente tengan el artículo en ese orden
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Qué quiere ordenar esta noche?!`,
      }),
    };
  }
  // enviar el mail
  const info = await transporter.sendMail({
    from: "Slick's Slices <slicks@example.com>",
    to: `${body.name} <${body.email}>, order@example.com`,
    subject: 'Nueva orden!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
