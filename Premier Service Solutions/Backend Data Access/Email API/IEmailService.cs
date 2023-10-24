namespace PremierSolutions.EmailAPI
{
    public interface IEmailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}