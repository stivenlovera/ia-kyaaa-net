export default async function Page() {
    /* return (
        <div className="w-screen h-screen flex items-center justify-center -mt-27">
            <div className="pt-40 pb-2 px-2 ">
                MIS COMPRAS
            </div>
        </div>
    ) */
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="card w-96">
                <div className="flex flex-col text-left">
                    <div className="center">
                        <img
                            className="img-logo"
                            src="https://usc1.contabostorage.com/698352ccd113428cb40866703a92c514:system/mail/marca-agua.png"
                            alt=""
                        />
                    </div>
                    <br />
                    <div className="font-bold text-2xl">Bienvenido a kyaaa</div>
                    <div>
                        <p>¡Hola, [Nombre del cliente]! 👋</p>
                        <br />
                        <p>
                            Nos alegramos muchísimo de que estés aquí. Ahora formas parte de
                            nuestra comunidad.
                        </p>
                        <br />
                        <p>
                            Verficemos tu correo electrónico para confirmar tu registrado.
                        </p>
                        <br />
                        <p>
                            Una vez verificado podras participar en votaciones de futuros pack y realizar comprar
                            y otro beneficios por estar registrado.
                        </p>
                        <p>
                            Descubre más sobre nosotros en nuestro sitio Sitio Web. ¡Te
                            esperamos!.
                        </p>
                        <br />
                        <p className="text-neutral-500">©2026 kyaaa.net</p>
                    </div>
                </div>
            </div>
        </div>
    )
}