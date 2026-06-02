export const notificationBeforeEmailHtml = (name: string, new_email: string): string => {
    return `<html lang="en">
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
          <div class="title">Vinculacion de correo</div>
          <div>
            <p>¡Hola, ${name}!</p>
            <p>
              Se a desvinculado este correo, por un nuevo correo: ${new_email}
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
