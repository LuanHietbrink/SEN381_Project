using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Konscious.Security.Cryptography;
using NuGet.Protocol;
using PremierSolutions.Data;
using PremierSolutions.Models;
using PremierSolutions.Procedures;
using System.Text;

namespace PremierSolutions.Controllers
{
    [Route("api/clients")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly PremierSolutionsContext _context;
        private readonly PremierSolutionsContextProcs _contextProcedures;

        public ClientController(PremierSolutionsContext context, PremierSolutionsContextProcs contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
          if (_context.Clients == null)
          {
              return NotFound();
          }
            return await _context.Clients.ToListAsync();
        }

        // GET: api/clients/find-client
        [HttpGet("find-client/{email}")]
        public async Task<ActionResult<Client>> GetClient(string email)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }

            var existingClient = await _context.Clients.FirstOrDefaultAsync(e => e.Email == email);
            
            if (existingClient == null)
            {
                return NotFound();
            }

            return existingClient;
        }

        // PUT: api/clients/edit-client/{email}
        [HttpPut("edit-client/{email}")]
        public async Task<IActionResult> PutClient(string email, Client client)
        {
            var existingClient = await _context.Clients.FirstOrDefaultAsync(e => e.Email == email);

            if (existingClient == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(client.ClientName))
            { existingClient.ClientName = client.ClientName; }

            if (!string.IsNullOrEmpty(client.ClientType))
            { existingClient.ClientType = client.ClientType; }   

            if (!string.IsNullOrEmpty(client.Email))
            { existingClient.Email = client.Email; }

            if (!string.IsNullOrEmpty(client.Password))
            {
                int iterations = 4;
                int memorySize = 65536;
                int parallelism = 4;

                using var hasher = new Argon2id(Encoding.UTF8.GetBytes(client.Password));
                hasher.Salt = Encoding.UTF8.GetBytes("YourSaltHere");
                hasher.DegreeOfParallelism = parallelism;
                hasher.MemorySize = memorySize;
                hasher.Iterations = iterations;

                byte[] hash = hasher.GetBytes(32);
                existingClient.Password = Convert.ToBase64String(hash);
            }

            if (!string.IsNullOrEmpty(client.ContactNumber))
            { existingClient.ContactNumber = client.ContactNumber; }

            if (!string.IsNullOrEmpty(client.Address))
            { existingClient.Address = client.Address; }

            if (!string.IsNullOrEmpty(client.ContactNumber))
            { existingClient.ContactNumber = client.ContactNumber; }

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Changes has been saved.");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(email))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/clients
        [HttpPost("client-signup")]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            if (_context.Clients == null)
            {
                return Problem("Entity set 'PremierSolutionsContext.Clients'  is null.");
            }

            if (client.Password != null)
            {
                int iterations = 4;
                int memorySize = 65536;
                int parallelism = 4;

                using var hasher = new Argon2id(Encoding.UTF8.GetBytes(client.Password));
                hasher.Salt = Encoding.UTF8.GetBytes("YourSaltHere");
                hasher.DegreeOfParallelism = parallelism;
                hasher.MemorySize = memorySize;
                hasher.Iterations = iterations;

                byte[] hash = hasher.GetBytes(32);
                client.Password = Convert.ToBase64String(hash);
            }

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            client.Password = null;

            return CreatedAtAction("GetClient", new { id = client.ClientId }, client);
        }

        // DELETE: api/clients/delete-client
        [HttpDelete("delete-client/{email}")]
        public async Task<IActionResult> DeleteClient(string email)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }

            var existingClient = await _context.Clients.FirstOrDefaultAsync(e => e.Email == email);
            
            if (existingClient == null)
            {
                return NotFound();
            }
            _context.Clients.Remove(existingClient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Stored procedure to get details for a specific client
        [HttpGet("client-details/{clientEmail}")]
        public async Task<IEnumerable<GetClientDetails>> GetClientDetails(string clientEmail)
        {
            var clientDetails = await _contextProcedures.SpGetClientDetails
                                .FromSqlRaw("call spGetClientDetails({0})", clientEmail)
                                .ToListAsync();

            var result = clientDetails.Select(details => new GetClientDetails
            {
                ClientId = details.ClientId,
                ClientType = details.ClientType,
                ClientName = details.ClientName,
                Email = details.Email,
                ContactNumber = details.ContactNumber,

                StartDate = details.StartDate,
                EndDate = details.EndDate,
                ContractType = details.ContractType,
                ServiceLevel = details.ServiceLevel,

                RequestId = details.RequestId ,
                RequestDate = details.RequestDate,
                RequestDetails = details.RequestDetails,
                Status = details.Status
            }).ToList();

            return result;
        }

        [HttpGet("client-info/{clientEmail}")]
        public async Task<IEnumerable<GetAllClientDetails>> GetClientInfo(string clientEmail)
        {
            return await _contextProcedures.SpGetAllClientDetails
                .FromSqlRaw("call spGetAllClientDetails({0})", clientEmail)
                .ToListAsync();
        }

        // Stored procedure to get details for a specific client for login verification
        [HttpPost("client-login/{email}/{password}")]
        public async Task<ActionResult> ClientLogin(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                return BadRequest("Email and password are required.");
            }

            var clientDetails = await _contextProcedures.SpGetAllClientDetails
                .FromSqlRaw("call spGetAllClientDetails({0})", email)
                .ToListAsync();

            if (clientDetails.Count == 0)
            {
                return NotFound();
            }

            string? storedPassword = clientDetails[0].Password;

            if (storedPassword != null)
            {                
                int iterations = 4;
                int memorySize = 65536;
                int parallelism = 4;

                using var hasher = new Argon2id(Encoding.UTF8.GetBytes(password));
                hasher.Salt = Encoding.UTF8.GetBytes("YourSaltHere");
                hasher.DegreeOfParallelism = parallelism;
                hasher.MemorySize = memorySize;
                hasher.Iterations = iterations;

                byte[] enteredPasswordHash = hasher.GetBytes(32);

                if (SlowEquals(enteredPasswordHash, Convert.FromBase64String(storedPassword)))
                {
                    return Ok("Login successful");
                }
                else
                {
                    return BadRequest("Invalid password");
                }
            }
            else
            {
                return BadRequest("Stored password is null or empty.");
            }
        }

        // A function to compare two byte arrays in a time-constant manner
        private static bool SlowEquals(byte[] a, byte[] b)
        {
            uint diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
            {
                diff |= (uint)(a[i] ^ b[i]);
            }
            return diff == 0;
        }

        private bool ClientExists(string email)
        {
            return (_context.Clients?.Any(e => e.Email == email)).GetValueOrDefault();
        }
    }
}