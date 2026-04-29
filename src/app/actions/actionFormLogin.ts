'use server';
import { z } from "zod";
import { db } from '../api/auth/_types/db';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/auth';
import { IFieldsFormLogin, IFormLogin, JWTPayload } from '../_types/user.type';
import logger, { jsonLog } from "../utils/logger";

export async function actionFormLogin(prevState: IFormLogin, formData: FormData): Promise<IFormLogin> {
    const email = formData.get('email');
    const password = formData.get('password');

    const fields: IFieldsFormLogin = {
        email: email?.toString(),
        password: password?.toString()
    }

    if (!email || !password) {
        return {
            success: false,
            errors: {
                email: !email ? "Email es requerido" : null,
                password: !password ? "Contraseña es requerido" : null,
            },
            fields: fields
        };
    }

    const emailSchema = z.email("email no valido");
    const validEmail = emailSchema.safeParse(email.toString());
    if (!validEmail.success) {
        return {
            success: false,
            errors: {
                email: validEmail.error?.issues[0].message
            },
            fields: fields
        };
    }

    const passwordSchema = z.string()
        .min(5, "Contraseña debe ser mayor a 5 characteres")
        .max(100, "Contraseña debe ser menor a 100 characteres");
    const validPassword = passwordSchema.safeParse(password.toString());
    logger.info(`validPassword  ${jsonLog(validPassword)}`)
    if (!validPassword.success) {
        return {
            success: false,
            errors: {
                password: validPassword.error?.issues[0].message
            },
            fields: fields
        };
    }

    const user = await db.findUserByEmail(email.toString());
    logger.info(`user ${jsonLog(user)}`)
    if (user === null) {
        return {
            success: false,
            errors: {
                email: "Credenciales invalidas",
                password: "Credenciales invalidas"
            },
            fields: fields
        };
    }
    const validUser = await db.verifyPassword(password?.toString(), user!.password!);
    logger.info(`validUser ${jsonLog(validUser)}`)
    if (!validUser) {
        return {
            success: false,
            errors: {
                email: "Credenciales invalidas",
                password: "Credenciales invalidas"
            },
            fields: fields
        };
    }

    const payload: JWTPayload = {
        user_id: user!.user_id,
        email: user!.email,
        name: user!.name,
        role: 'user'
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    return { success: true, fields: fields, errors: {} };
}