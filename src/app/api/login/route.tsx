
import bcrypt, { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IUser } from '../../types/user.type';

const mockUsers: IUser[] = [
    {
        id: 1, full_name: 'admin', password: '$2b$10$g8ece2qlg.LSJHcXYku5fe.gc0q/z8nifVatywPRh7nNoMU4yaMY6',
        nick: 'Ali stiven lovera huarachi',
        email: 'stivenlovera@gmail.com',
        remember_token: null
    } // Hashed password
];

export async function POST(req: NextRequest) {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync("123456789", salt);

        //console.log('hash ',hash)

        const { email, password } = await req.json();
        console.log('request ',email, password)

        // Find the user
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
        }

        // Verify the password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.full_name }, // The payload contains userid and username
            process.env.JWT_SECRET!,
            { expiresIn: parseInt(process.env.JWT_EXPIRES_IN!) }
        );

        // Set an HttpOnly Cookie (security attribute)
        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
            sameSite: 'lax', // Prevent CSRF attacks
            maxAge: Number(process.env.JWT_EXPIRES_IN),
            path: '/'
        });

        return response;
    }
    catch {

    }
}