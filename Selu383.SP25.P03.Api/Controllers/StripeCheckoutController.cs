using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeCheckoutController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        public StripeCheckoutController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        [HttpPost("create-checkout-session")]
        public ActionResult CreateCheckoutSession([FromBody] CheckoutSessionRequest request)
        {
            
            var domain = "http://localhost:5173"; 
            
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            UnitAmount = request.Amount, 
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.ProductName ?? "Product",
                                Description = request.Description ?? string.Empty
                            }
                        },
                        Quantity = 1
                    }
                },
                PaymentMethodTypes = new List<string> { "card" },
                Mode = "payment",
                SuccessUrl = $"{domain}/payment-success",
                CancelUrl = $"{domain}/payment-canceled"
            };
            
            var service = new SessionService();
            var session = service.Create(options);
            
            return Ok(new { sessionId = session.Id, url = session.Url });
        }
    }
    
    public class CheckoutSessionRequest
    {
        public long Amount { get; set; } 
        public string? ProductName { get; set; }
        public string? Description { get; set; }
    }
}