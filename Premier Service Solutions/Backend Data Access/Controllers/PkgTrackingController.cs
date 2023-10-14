using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PremierSolutions.Data;
using PremierSolutions.Models;

namespace PremierSolutions.Controllers
{
    [Route("api/package-tracking")]
    [ApiController]
    public class PkgTrackingController : ControllerBase
    {
        private readonly PremierSolutionsContext _context;

        public PkgTrackingController(PremierSolutionsContext context)
        {
            _context = context;
        }

        // GET: api/package-tracking
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Packagetracking>>> GetPackagetrackings()
        {
          if (_context.Packagetrackings == null)
          {
              return NotFound();
          }
            return await _context.Packagetrackings.ToListAsync();
        }

        // GET: api/package-tracking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Packagetracking>> GetPackagetracking(int id)
        {
          if (_context.Packagetrackings == null)
          {
              return NotFound();
          }
            var packagetracking = await _context.Packagetrackings.FindAsync(id);

            if (packagetracking == null)
            {
                return NotFound();
            }

            return packagetracking;
        }

        // PUT: api/package-tracking/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPackagetracking(int id, Packagetracking packagetracking)
        {
            if (id != packagetracking.PackageId)
            {
                return BadRequest();
            }

            _context.Entry(packagetracking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PackagetrackingExists(id))
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

        // POST: api/package-tracking
        [HttpPost]
        public async Task<ActionResult<Packagetracking>> PostPackagetracking(Packagetracking packagetracking)
        {
          if (_context.Packagetrackings == null)
          {
              return Problem("Entity set 'PremierSolutionsContext.Packagetrackings'  is null.");
          }
            _context.Packagetrackings.Add(packagetracking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPackagetracking", new { id = packagetracking.PackageId }, packagetracking);
        }

        // DELETE: api/package-tracking/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackagetracking(int id)
        {
            if (_context.Packagetrackings == null)
            {
                return NotFound();
            }
            var packagetracking = await _context.Packagetrackings.FindAsync(id);
            if (packagetracking == null)
            {
                return NotFound();
            }

            _context.Packagetrackings.Remove(packagetracking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PackagetrackingExists(int id)
        {
            return (_context.Packagetrackings?.Any(e => e.PackageId == id)).GetValueOrDefault();
        }
    }
}