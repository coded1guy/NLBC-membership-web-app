export interface passwordResetTemplate {
  username: string;
  resetLink: string;
  span: string;
  supportEmail: string;
}

const ResetPasswordTemplate = ({
  username,
  resetLink,
  span,
  supportEmail,
}: passwordResetTemplate) => {
  return `
    <div style="font-size: 16px; line-height: 1.6; margin: 0 0 20px">
      <p style="color: #000000">Hey ${username},</p>
      <p><br /></p>
      <p style="color: #000000">
        We have received a request to reset the password for your NLBC
        membership account. If you did not initiate this request, please
        disregard this email.
      </p>
      <p><br /></p>
      <ul>
        <li style="color: #000000">
          <strong>
            To proceed with the password reset, please click on the button below:
          </strong>
          <a
            href="${resetLink}"
            rel="noopener noreferrer"
            target="_blank"
            style="
              display: block;
              width: 150px;
              text-align: center;
              padding: 10px 20px;
              text-decoration: none;
              background: #465902;
              border-radius: 5px;
              color: #ffffff;
              font-family: inherit;
            "
          >
            Reset Password
          </a>
        </li>
        <br />
        <li style="color: #000000">
          <strong>
            If the button above doesn't work, copy and paste 
            the following link into your web browser:
          </strong>
          <br />
          <a
            href="${resetLink}"
            rel="noopener noreferrer"
            target="_blank"
            style="
              text-decoration: none;
              color: #465902;
              font-family: inherit;
            "
          >
            ${resetLink}
          </a>.
        </li>
      </ul>
      <p><br /></p>
      <p style="color: #000000">
        Please note that this link is valid for ${span}. After this
        time, you will need to submit another password reset request.
      </p>
      <p style="color: #000000">
        <span>
          If you encounter any issues or need further assistance, please
          don't hesitate to contact our support team at
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
        Wishing you a fruitful stay on our platform.
      </p>
      <p><br /></p>
      <p style="color: #000000">Yours Sincerely,</p>
      <p style="color: #000000">NLBC Platform<br /><br /></p>
    </div>   
  `;
};
export default ResetPasswordTemplate;
