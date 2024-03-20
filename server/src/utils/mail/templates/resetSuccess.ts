export interface resetSuccessTemplate {
  username: string;
  supportEmail: string;
}
const ResetSuccessTemplate = ({
  username,
  supportEmail,
}: resetSuccessTemplate) => {
  return `
    <div style="font-size: 16px; line-height: 1.6; margin: 0 0 20px">
      <p style="color: #000000">Hey ${username},</p>
      <p><br /></p>
      <p style="color: #000000">
        We're writing to inform you that your password has been successfully reset.
        If you initiated this change, you can disregard this email.
      </p>
      <p><br /></p>
      <p style="color: #000000">
        <span>
          If you did not request this password change or believe it was 
          unauthorized, please contact our support team immediately at 
        </span>
        <a
          href="mailto:${supportEmail}"
          rel="noopener noreferrer"
          target="_blank"
          style="
            text-decoration: none;
            color: #465902;
            font-family: inherit;
          "
        >
          ${supportEmail}
        </a>.
      </p>
      <p style="color: #000000">
        For security reasons, we recommend reviewing your account settings 
        and ensuring that your account information is up to date.
      </p>
      <p><br /></p>
      <p style="color: #000000">Yours Sincerely,</p>
      <p style="color: #000000">NLBC Platform<br /><br /></p>
    </div>
  `;
};
export default ResetSuccessTemplate;
