using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;


namespace PremierSolutions.EmailAPI
{
    [Route("api/auto-email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService emailService;
        private readonly PremierSolutionsContextProcs _contextProcedures;


        public EmailController(IEmailService _emailService, PremierSolutionsContextProcs contextProcedures) { 
            emailService = _emailService;
            _contextProcedures = contextProcedures;
        }

        [HttpPost("send-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var employeeDetails = await _contextProcedures.SpGetEmployeeDetails
                                            .FromSqlRaw("call spGetEmployeeDetails({0})", email)
                                            .ToListAsync();

            if (employeeDetails == null || employeeDetails.Count == 0)
            {
                return NotFound("Employee with the given email does not exist.");
            }

            try
            {
                var employee = employeeDetails.First(); 

                string? firstName = employee.FirstName;
                string? lastName = employee.LastName;

                string body = $"Dear {firstName} {lastName},<br><br>" +
                            "You have a maintenance job alert. Please visit your dashboard for more information.<br><br>" +
                            "--<br><br>"+
                            "Regards,<br>Premier Service Solutions.<br>"+
                            "Administration Team<br>"+
                            "premier.service.solution13@gmail.com<br>"+
                            "www.premierservicesolutions.com<br>";

                MailRequest mailRequest = new()
                {
                    ToEmail = email,
                    Subject = "Maintenance Job Alert",
                    Body = body
                };
                
                await emailService.SendEmailAsync(mailRequest);
                return Ok();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}