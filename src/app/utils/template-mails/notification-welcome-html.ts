export const welcomeEmailHtml = (name: string): string => {
    return `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to kyaaa</title>
    <style>
      .body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
      }
      .title {
        font-weight: bold;
        font-size: 25px;
      }
      .footer {
        color: cadetblue;
        font-size: 14px;
      }
      .container {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
      }
      .flex-col {
        display: flex;
        flex-direction: column; /* This is the 'flex-col' equivalent */
      }
      .img-logo {
        width: auto !important;
        height: auto !important;
        max-width: 50%;
      }
      .card {
        max-width: 600px;
      }
      .center {
        display: flex;
        text-align: center;
        justify-content: center;
      }
    </style>
  </head>
  <body class="body">
    <div class="container">
      <div class="card">
        <div class="">
          <div class="center">
            <img
              class="img-logo"
              src="https://static.kyaaa.net/system/logo-email.png"
              alt="logo"
            />
          </div>
          <br />
          <div class="title">Bienvenido a kyaaa</div>
          <div>
            <p>¡Hola, ${name}! 👋</p>
            Nos alegramos muchísimo de que estés aquí. Ahora formas parte de
            nuestra comunidad.
            <p>
              No olvides verificar tu correo.
            </p>
            <p>
              Una vez verificado podras participar en votaciones de futuros pack y realizar comprar
              y otro beneficios por estar registrado.
            </p>
            <p>
              Descubre más sobre nosotros en nuestro sitio Sitio Web <a href="${process.env.URL_BASE}">Kyaaa.net</a> ¡Te
              esperamos!.
            </p>
            <p class="footer">©2026 kyaaa</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`
}