import { Router } from 'express';
// force reload
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import { validateRequest } from '../../core/middleware/validate.middleware.js';
import { loginSchema, registerSchema, updateProfileSchema } from '@finsight/shared';
import { env } from '../../core/config/env.js';
import { authService } from './auth.service.js';

const router = Router();

// Passport Google Setup
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await authService.handleGoogleOAuth(profile);
      return done(null, result);
    } catch (err) {
      return done(err as Error);
    }
  }));
}

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/demo', authController.demoLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);
router.patch('/me', requireAuth, validateRequest(updateProfileSchema), authController.updateProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), authController.googleCallback);

export const authRouter = router;
