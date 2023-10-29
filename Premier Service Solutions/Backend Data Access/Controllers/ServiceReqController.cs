using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;
using PremierSolutions.Models;
using PremierSolutions.Procedures;

namespace PremierSolutions.Controllers
{
    [Route("api/service-requests")]
    [ApiController]
    public class ServiceReqController : ControllerBase
    {
        private readonly PremierSolutionsContext _context;
        private readonly PremierSolutionsContextProcs _contextProcedures;

        public ServiceReqController(PremierSolutionsContext context, PremierSolutionsContextProcs contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/service-requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Servicerequest>>> GetServicerequests()
        {
          if (_context.Servicerequests == null)
          {
              return NotFound();
          }
            return await _context.Servicerequests.ToListAsync();
        }

        // GET: api/service-requests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Servicerequest>> GetServicerequest(int id)
        {
          if (_context.Servicerequests == null)
          {
              return NotFound();
          }
            var servicerequest = await _context.Servicerequests.FindAsync(id);

            if (servicerequest == null)
            {
                return NotFound();
            }

            return servicerequest;
        }

        // PUT: api/service-requests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicerequest(int id, Servicerequest servicerequest)
        {
            if (id != servicerequest.RequestId)
            {
                return BadRequest();
            }

            _context.Entry(servicerequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicerequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/service-requests/log-request
        [HttpPost("log-request")]
        public async Task<ActionResult<Servicerequest>> PostServicerequest(Servicerequest servicerequest)
        {
          if (_context.Servicerequests == null)
          {
              return Problem("Entity set 'PremierSolutionsContext.Servicerequests'  is null.");
          }
            _context.Servicerequests.Add(servicerequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServicerequest", new { id = servicerequest.RequestId }, servicerequest);
        }

        // DELETE: api/service-requests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicerequest(int id)
        {
            if (_context.Servicerequests == null)
            {
                return NotFound();
            }
            var servicerequest = await _context.Servicerequests.FindAsync(id);
            if (servicerequest == null)
            {
                return NotFound();
            }

            _context.Servicerequests.Remove(servicerequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Stored procedure to get all active service requests
        [HttpGet("active-jobs")]
        public async Task<IEnumerable<GetActiveJobs>> GetActiveJobs()
        {
            return await _contextProcedures.SpGetActiveJobs
                .FromSqlRaw("call spGetActiveJobs()")
                .ToListAsync();
        }

        // Stored procedure to get all service requests for a specific client
        [HttpGet("client-requests/{clientId}")]
        public async Task<IEnumerable<GetClientServiceReq>> GetClientRequests(int clientId)
        {
            return await _contextProcedures.SpGetClientServiceReqs
                .FromSqlRaw("call spGetClientServiceRequests({0})", clientId)
                .ToListAsync();
        }

        // Stored procedure to get all requests for a specific employee
        [HttpGet("employee-requests/{employeeId}")]
        public async Task<IEnumerable<GetMaintenanceJobs>> GetMaintenanceJobs(int employeeId)
        {
            return await _contextProcedures.SpGetMaintenanceJobs
                .FromSqlRaw("call spGetMaintenanceJobs({0})", employeeId)
                .ToListAsync();
        }

        private bool ServicerequestExists(int id)
        {
            return (_context.Servicerequests?.Any(e => e.RequestId == id)).GetValueOrDefault();
        }
    }
}