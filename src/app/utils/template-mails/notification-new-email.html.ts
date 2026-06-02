export const notificationNewEmailHtml = (name: string): string => {
    return `
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to kyaaa</title>
    <style>
      .body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
      }
      .title {
        font-weight: bold;
        font-size: 30px;
      }
      .footer {
        color: cadetblue;
        font-size: 18px;
      }
      .container {
        text-align: center;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .flex-col {
        display: flex;
        flex-direction: column;
      }
      .img-logo {
        width: auto !important;
        height: auto !important;
        max-width: 42%;
      }
      .card {
        max-width: 600px;
      }
      .center {
        text-align: center;
        justify-content: center;
        align-items: center;
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
              alt=""
            />
          </div>
          <br />
          <div class="title">Nuevo de correo registrado</div>
          <div>
            <p>¡Hola, ${name}! haz registrado este correo nuevo.</p>
            <p>
              No olvides verificar este correo.
            </p>
            <p>
              Una vez verificado podras participar en votaciones de futuros pack y realizar comprar
              y otro beneficios por estar registrado.
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