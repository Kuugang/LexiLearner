// using System;
// using System.IO;
// using System.Text;
// using System.Threading.Tasks;
// using System.Net.Mail;
// using System.Net.Mime;

namespace LexiLearner
{
    public class EmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var message = new System.Net.Mail.MailMessage
            {
                From = new System.Net.Mail.MailAddress(Environment.GetEnvironmentVariable("EMAIL_SENDER_ADDRESS")),
                Subject = subject,
                // SubjectEncoding = Encoding.UTF8,
                // BodyEncoding = Encoding.UTF8,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(to);
            // var content = await File.ReadAllTextAsync("template2.html");
            // content = content.Replace("<%= name %>", "LEXI LeARN");
            //
            // var alternativeView = AlternateView.CreateAlternateViewFromString(content, new ContentType(MediaTypeNames.Text.Html));
            // message.AlternateViews.Add(alternativeView);

            using (var client = new System.Net.Mail.SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new System.Net.NetworkCredential(Environment.GetEnvironmentVariable("EMAIL_SENDER_ADDRESS"), Environment.GetEnvironmentVariable("GMAIL_APP_PASSWORD")),
                EnableSsl = true
            })
            {
                await client.SendMailAsync(message);
            }
        }
    }
}
