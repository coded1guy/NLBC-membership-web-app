const EmailWrapper = (supportEmail: string, template: string) => {
  const logoUrl = '';
  const year = new Date().getFullYear();
  const corporation = 'New Life Baptist Church (NLBC), Isolo, Lagos';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>password reset</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
        <style>
          h2,
          h3,
          h4,
          p,
          a,
          button {
            font-family: inherit;
          }
          p {
            margin: 4px 0;
          }
        </style>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #dbedbf;
          font-family: 'Inter', Verdana, Geneva, Tahoma, sans-serif;
          font-size: 16px;
        "
      >
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td style="width: 100%; text-align: center">
              <img
                style="width: 200px; margin: 20px auto; height: auto"
                src="${logoUrl}"
                alt="${corporation}"
              />
            </td>
          </tr>
        </table>
      
        <table
          style="width: 600px; margin: 0 auto"
          role="presentation"
          cellspacing="0"
          cellpadding="0"
        >
          <tr>
            <td
              style="background-color: #ffffff; border-radius: 8px; padding: 30px"
            >
              ${template}

              <p style="font-size: 13px; color: #19220a; margin: 20px 0 0">
                If you have any questions, please contact us at
                <a
                  style="
                    font-size: 13px;
                    display: inline;
                    background: transparent;
                    padding: 0;
                    color: #465902;
                    font-weight: 400;
                  "
                  href="mailto:${supportEmail}"
                >
                  ${supportEmail}
                </a>
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td
              style="
                padding: 20px 0;
                text-align: center;
                color: #19220a;
                font-size: 12px;
              "
            >
              &copy; ${year} ${corporation}. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>    
  `;
};
export default EmailWrapper;
