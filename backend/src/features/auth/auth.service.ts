import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../core/config/env.js';
import { authRepository } from './auth.repository.js';
import { AuthenticationError, ConflictError } from '../../core/errors/app-error.js';
import { LoginInput, RegisterInput, UserResponse, UpdateProfileInput } from '@finsight/shared';
import { User } from '@prisma/client';
import { Profile } from 'passport-google-oauth20';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthService {
  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: user.provider,
      currency: user.currency,
    };
  }

  async register(data: RegisterInput) {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await authRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      provider: 'local',
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, refreshToken);

    return { user: this.mapToUserResponse(user), accessToken, refreshToken };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, refreshToken);

    return { user: this.mapToUserResponse(user), accessToken, refreshToken };
  }

  async demoLogin() {
    let user = await authRepository.findByEmail('demo@finsight.local');
    if (!user) {
      const passwordHash = await bcrypt.hash('demopassword123', 12);
      user = await authRepository.create({
        email: 'demo@finsight.local',
        name: 'Demo User',
        passwordHash,
        provider: 'local',
      });
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, refreshToken);
    return { user: this.mapToUserResponse(user), accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await authRepository.findById(decoded.userId);
      
      if (!user || user.refreshToken !== token) {
        throw new AuthenticationError('Invalid refresh token');
      }

      const { accessToken, refreshToken } = this.generateTokens(user.id);
      await authRepository.updateRefreshToken(user.id, refreshToken);

      return { accessToken, refreshToken };
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await authRepository.updateRefreshToken(userId, null);
  }

  async getUserById(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return this.mapToUserResponse(user);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    const updateData: any = {};
    if (data.currency !== undefined) updateData.currency = data.currency;

    const updated = await authRepository.update(userId, updateData);
    return this.mapToUserResponse(updated);
  }

  async handleGoogleOAuth(profile: Profile) {
    let user = await authRepository.findByProviderId(profile.id);
    
    if (!user) {
      // Check if email exists
      if (!profile.emails?.[0]?.value) throw new AuthenticationError('No email from Google');
      user = await authRepository.findByEmail(profile.emails[0].value);
      
      if (user) {
        // Link account (in a real app you might want to handle this differently)
        throw new ConflictError('Email already registered via different provider');
      }

      user = await authRepository.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value || null,
        provider: 'google',
        providerId: profile.id,
      });
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await authRepository.updateRefreshToken(user.id, refreshToken);

    return { user: this.mapToUserResponse(user), accessToken, refreshToken };
  }
}

export const authService = new AuthService();
