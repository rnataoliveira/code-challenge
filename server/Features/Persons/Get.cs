using server.Models;
using MediatR;
using System;
using server.Shared;
using System.Threading;
using System.Threading.Tasks;
using server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;

namespace server.Features.Persons
{
    public class Get
    {
        public class Query : IRequest<PersonViewModel>
        {
            public Guid? PersonId { get; set; }

            public string OwnerId { get; set; }
        }

        public class Handler : IRequestHandler<Query, PersonViewModel>
        {
            readonly ApplicationDbContext _context;

            public Handler(ApplicationDbContext context)
            {
                _context = context;
            }

            public async Task<PersonViewModel> Handle(Query request, CancellationToken cancellationToken)
            {
                var person = await _context.Persons
                    .Where(p => p.OwnerId == request.OwnerId)
                    .Include(p => p.Vaccines)
                    .FirstOrDefaultAsync(p => p.Id == request.PersonId);

                return person != null ? new PersonViewModel(person) : null;
            }
        }
    }
}