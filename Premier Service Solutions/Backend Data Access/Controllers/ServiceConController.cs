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
    [Route("api/service-contracts")]
    [ApiController]
    public class ServiceConController : ControllerBase
    {
        private readonly PremierSolutionsContext _context;
        private readonly PremierSolutionsContextProcs _contextProcedures;

        public ServiceConController(PremierSolutionsContext context, PremierSolutionsContextProcs contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/service-contracts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Servicecontract>>> GetServicecontracts()
        {
          if (_context.Servicecontracts == null)
          {
              return NotFound();
          }
            return await _context.Servicecontracts.ToListAsync();
        }

        // GET: api/service-contracts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Servicecontract>> GetServicecontract(int id)
        {
          if (_context.Servicecontracts == null)
          {
              return NotFound();
          }
            var servicecontract = await _context.Servicecontracts.FindAsync(id);

            if (servicecontract == null)
            {
                return NotFound();
            }

            return servicecontract;
        }

        // PUT: api/service-contracts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicecontract(int id, Servicecontract servicecontract)
        {
            if (id != servicecontract.ContractId)
            {
                return BadRequest();
            }

            _context.Entry(servicecontract).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicecontractExists(id))
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

        // POST: api/service-contracts
        [HttpPost]
        public async Task<ActionResult<Servicecontract>> PostServicecontract(Servicecontract servicecontract)
        {
          if (_context.Servicecontracts == null)
          {
              return Problem("Entity set 'PremierSolutionsContext.Servicecontracts'  is null.");
          }
            _context.Servicecontracts.Add(servicecontract);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServicecontract", new { id = servicecontract.ContractId }, servicecontract);
        }

        // DELETE: api/service-contracts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicecontract(int id)
        {
            if (_context.Servicecontracts == null)
            {
                return NotFound();
            }
            var servicecontract = await _context.Servicecontracts.FindAsync(id);
            if (servicecontract == null)
            {
                return NotFound();
            }

            _context.Servicecontracts.Remove(servicecontract);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Stored procedure to get all active contracts
        [HttpGet("active-contracts")]
        public async Task<IEnumerable<GetActiveContracts>> GetActiveContracts()
        {
            return await _contextProcedures.SpGetActiveContracts
                .FromSqlRaw("call spGetActiveContracts()")
                .ToListAsync();
        }

        private bool ServicecontractExists(int id)
        {
            return (_context.Servicecontracts?.Any(e => e.ContractId == id)).GetValueOrDefault();
        }
    }
}