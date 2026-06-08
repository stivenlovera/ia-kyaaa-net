import { NextRequest, NextResponse } from 'next/server';
import { LoginCredentials } from '../_types/login';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/src/app/utils/auth';
import { JWTPayload } from '@/src/app/types/user.type';
import { repositoryAuth } from '@/src/app/repositories/auth.repository';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await repositoryAuth.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await repositoryAuth.verifyPassword(password, user.password!);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const payload: JWTPayload = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      role: 'user'
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    const sanitizedUser = repositoryAuth.sanitizeUser(user);

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sanitizedUser,
        accessToken,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}