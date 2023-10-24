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

        // GET: api/clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
          if (_context.Clients == null)
          {
              return NotFound();
          }
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // PUT: api/clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.ClientId)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
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
            else 
            {
                return BadRequest("Password is null or empty.");
            }

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            client.Password = null;

            return CreatedAtAction("GetClient", new { id = client.ClientId }, client);
        }

        // DELETE: api/clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            if (_context.Clients == null)
            {
                return NotFound();
            }
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Stored procedure to get details for a specific client
        [HttpGet("client-details/{clientEmail}")]
        public async Task<IEnumerable<GetClientDetails>> GetClientDetails(string clientEmail)
        {
            return await _contextProcedures.SpGetClientDetails
                .FromSqlRaw("call spGetClientDetails({0})", clientEmail)
                .ToListAsync();
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

        private bool ClientExists(int id)
        {
            return (_context.Clients?.Any(e => e.ClientId == id)).GetValueOrDefault();
        }
    }
}