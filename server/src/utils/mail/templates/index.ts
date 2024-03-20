import ResetPasswordTemplate from './resetPassword';
import ResetSuccessTemplate from './resetSuccess';
import EmailWrapper from './wrapper';

/* PASSWORD RESET */
const supportEmail = 'newlifebcokeafa@gmail.com';
// reset password email template
const span = '1 hour';
export function resetPasswordEmail(username: string, resetLink: string) {
  return EmailWrapper(
    supportEmail,
    ResetPasswordTemplate({ username, resetLink, span, supportEmail })
  );
}
// reset success email template
export function resetSuccessEmail(username: string) {
  return EmailWrapper(
    supportEmail,
    ResetSuccessTemplate({ username, supportEmail })
  );
}
