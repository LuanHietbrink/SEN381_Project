using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Security;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace PremierSolutions.EmailAPI
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings emailSettings;
        
        public EmailService(IOptions<EmailSettings> options) { 
            emailSettings = options.Value;
        }

        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var email = new MimeMessage
            {
                From = { new MailboxAddress(emailSettings.DisplayName, emailSettings.Email) }
            };
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;

            var builder = new BodyBuilder
            {
                HtmlBody = mailRequest.Body
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.Connect(emailSettings.Host, emailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(emailSettings.Email, emailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
    }
}