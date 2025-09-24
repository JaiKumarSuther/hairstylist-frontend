# Forgot Password Setup Guide

This guide explains how to set up the forgot password functionality for the Hairstylist application.

## Overview

The forgot password system includes:
- **Frontend**: Forgot password and reset password pages
- **Backend**: API endpoints for password reset
- **Database**: New fields for reset tokens
- **Email**: Automated password reset emails

## Files Created/Modified

### Frontend (Next.js)
- `app/(auth)/forgot-password/page.tsx` - Forgot password form
- `app/(auth)/reset-password/page.tsx` - Reset password form
- `store/authStore.ts` - Added forgot/reset password methods
- `hooks/useAuth.ts` - Exposed new methods

### Backend (Node.js)
- `src/controllers/authController.js` - Added forgot/reset password endpoints
- `src/routes/auth.js` - Added new routes
- `src/utils/email.js` - Updated email template
- `prisma/schema.prisma` - Added reset token fields
- `src/scripts/migrate-password-reset.js` - Migration helper

## Database Changes

The User model now includes:
```prisma
model User {
  // ... existing fields
  resetPasswordToken String?
  resetPasswordExpires DateTime?
  // ... rest of fields
}
```

## Setup Instructions

### 1. Database Migration

Run the following commands in the backend directory:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Or create a migration (recommended for production)
npx prisma migrate dev --name add-password-reset-fields
```

### 2. Environment Variables

Ensure these environment variables are set in your backend `.env`:

```env
# Email configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
FRONTEND_URL=http://localhost:3000
```

### 3. Email Configuration

The system uses Nodemailer for sending emails. Configure your SMTP settings in the backend environment variables.

## API Endpoints

### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: Success message (doesn't reveal if email exists)

### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ "token": "reset-token", "password": "new-password", "confirmPassword": "new-password" }`
- **Response**: Success message

## Frontend Routes

- `/forgot-password` - Request password reset
- `/reset-password?token=abc123` - Reset password with token

## Security Features

1. **Token Expiration**: Reset tokens expire after 1 hour
2. **One-time Use**: Tokens are invalidated after successful reset
3. **Email Privacy**: System doesn't reveal if email exists
4. **Rate Limiting**: Endpoints are protected by rate limiting
5. **Input Validation**: Password requirements and confirmation

## Testing

### Manual Testing
1. Go to `/forgot-password`
2. Enter a valid email address
3. Check email for reset link
4. Click reset link to go to `/reset-password`
5. Enter new password and confirm
6. Verify password was changed

### Email Testing
- Ensure SMTP credentials are correct
- Check spam folder for reset emails
- Verify email template renders correctly

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SMTP credentials
   - Verify network connectivity
   - Check email service provider limits

2. **Token not working**
   - Ensure database migration completed
   - Check token expiration (1 hour limit)
   - Verify token format in URL

3. **Database errors**
   - Run `npx prisma db push` to sync schema
   - Check database connection
   - Verify Prisma client is generated

### Debug Steps

1. Check backend logs for errors
2. Verify environment variables
3. Test database connection
4. Check email service status

## Production Considerations

1. **Email Service**: Use a reliable email service (SendGrid, AWS SES, etc.)
2. **Rate Limiting**: Configure appropriate rate limits
3. **Monitoring**: Set up email delivery monitoring
4. **Backup**: Ensure database backups include new fields
5. **Security**: Regularly rotate SMTP credentials

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Test with a simple email first
4. Check database schema matches Prisma schema
