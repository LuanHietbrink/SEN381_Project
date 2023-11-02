using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Konscious.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;
using PremierSolutions.EmailAPI;
using PremierSolutions.Models;
using PremierSolutions.Procedures;

namespace PremierSolutions.Controllers
{
    [Route("api/employees")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly PremierSolutionsContext _context;
        private readonly PremierSolutionsContextProcs _contextProcedures;

        public EmployeeController(PremierSolutionsContext context, PremierSolutionsContextProcs contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            if (_context.Employees == null)
            {
                return NotFound();
            }
            
            return await _context.Employees.ToListAsync();
        }

        // GET: api/employees/find-employee
        [HttpGet("find-employee/{email}")]
        public async Task<ActionResult<Employee>> GetEmployee(string email)
        {
            if (_context.Employees == null)
            {
                return NotFound();
            }

            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);
            
            if (existingEmployee == null)
            {
                return NotFound();
            }

            return existingEmployee;
        }

        // PUT: api/employees/edit-employee/{email}
        [HttpPut("edit-employee/{email}")]
        public async Task<IActionResult> PutEmployee(string email, [FromBody] Employee employee)
        {
            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);

            if (existingEmployee == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(employee.FirstName))
            { existingEmployee.FirstName = employee.FirstName; }

            if (!string.IsNullOrEmpty(employee.LastName))
            { existingEmployee.LastName = employee.LastName; }

            if (!string.IsNullOrEmpty(employee.Email))
            { existingEmployee.Email = employee.Email; }

            if (!string.IsNullOrEmpty(employee.Password))
            {
                int iterations = 4;
                int memorySize = 65536;
                int parallelism = 4;

                using var hasher = new Argon2id(Encoding.UTF8.GetBytes(employee.Password));
                hasher.Salt = Encoding.UTF8.GetBytes("YourSaltHere");
                hasher.DegreeOfParallelism = parallelism;
                hasher.MemorySize = memorySize;
                hasher.Iterations = iterations;

                byte[] hash = hasher.GetBytes(32);
                existingEmployee.Password = Convert.ToBase64String(hash);
            }

            if (!string.IsNullOrEmpty(employee.ContactNumber))
            { existingEmployee.ContactNumber = employee.ContactNumber; }

            if (!string.IsNullOrEmpty(employee.EmgContact))
            { existingEmployee.EmgContact = employee.EmgContact; }

            if (!string.IsNullOrEmpty(employee.Skills))
            { existingEmployee.Skills = employee.Skills; }

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Changes has been saved.");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(email))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/employees/employee-signup
        [HttpPost("employee-signup")]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            if (_context.Employees == null)
            {
                return Problem("Entity set 'PremierSolutionsContext.Employees'  is null.");
            }

            if (employee.Password != null)
            {
                int iterations = 4;
                int memorySize = 65536;
                int parallelism = 4;

                using var hasher = new Argon2id(Encoding.UTF8.GetBytes(employee.Password));
                hasher.Salt = Encoding.UTF8.GetBytes("YourSaltHere");
                hasher.DegreeOfParallelism = parallelism;
                hasher.MemorySize = memorySize;
                hasher.Iterations = iterations;

                byte[] hash = hasher.GetBytes(32);
                employee.Password = Convert.ToBase64String(hash);
            } 

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            employee.Password = null;
            
            return CreatedAtAction("GetEmployee", new { id = employee.EmpId }, employee);
        }

        // DELETE: api/employees/delete-employee/
        [HttpDelete("delete-employee/{email}")]
        public async Task<IActionResult> DeleteEmployee(string email)
        {
            if (_context.Employees == null)
            {
                return Problem("Entity set 'PremierSolutionsContext.Employees'  is null.");
            }

            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);
            
            if (existingEmployee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(existingEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("employee-info/{email}")]
        public async Task<IEnumerable<GetEmployeeDetails>> GetEmployeeInfo(string email)
        {
            return await _contextProcedures.SpGetEmployeeDetails
                .FromSqlRaw("call spGetEmployeeDetails({0})", email)
                .ToListAsync();
        }

        [HttpPost("new-employee-login/{email}")]
        public async Task<ActionResult> NewEmployeeLogin(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var employeeDetails = await _contextProcedures.SpGetEmployeeDetails
                .FromSqlRaw("call spGetEmployeeDetails({0})", email)
                .ToListAsync();

            if (employeeDetails.Count == 0)
            {
                return NotFound();
            }

            return Ok("Login successful");
        }

        // Stored procedure to get details for a specific employee
        [HttpPost("employee-login/{email}/{password}")]
        public async Task<ActionResult> EmployeeLogin(string email, string password)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var employeeDetails = await _contextProcedures.SpGetEmployeeDetails
                .FromSqlRaw("call spGetEmployeeDetails({0})", email)
                .ToListAsync();

            if (employeeDetails.Count == 0)
            {
                return NotFound();
            }

            string? storedPassword = employeeDetails[0].Password;

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
            else if ((storedPassword == null) && (employeeDetails.Count != 0)) 
            {
                return Ok("Login successful");
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

        private bool EmployeeExists(string email)
        {
            return (_context.Employees?.Any(e => e.Email == email)).GetValueOrDefault();
        }
    }
}