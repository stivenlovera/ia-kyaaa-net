import { NextRequest, NextResponse } from 'next/server';
import { RegisterData } from '../_types/login';
import { repositoryAuth } from '@/src/app/repositories/repository-auth';

export async function POST(request: NextRequest) {
    try {
    const body: RegisterData = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await repositoryAuth.createUser(name, email, password);
    const sanitizedUser = repositoryAuth.sanitizeUser(user);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: sanitizedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}