
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;

namespace Selu383.SP25.P03.Api.Features.Payments
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StripeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("create-setup-intent")]
        public ActionResult CreateSetupIntent([FromBody] SetupIntentRequest request)
        {
            try
            {
                var setupIntentService = new SetupIntentService();
                var setupIntentOptions = new SetupIntentCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    
                    Customer = request.CustomerId,
                    
                    Metadata = new Dictionary<string, string>
                    {
                        { "userId", request.UserId }
                    }
                };

                var setupIntent = setupIntentService.Create(setupIntentOptions);

                return Ok(new { 
                    clientSecret = setupIntent.ClientSecret,
                    setupIntentId = setupIntent.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class SetupIntentRequest
    {
        public string CustomerId { get; set; } 
        public string UserId { get; set; } 
    }
}
