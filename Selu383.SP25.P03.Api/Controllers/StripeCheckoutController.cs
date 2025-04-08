/*
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
            // Get your frontend domain from configuration or hardcode for development
            var domain = "http://localhost:5173"; // Change to match your React app's URL

            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        // For one-time payments, you can use PriceData to define the product on the fly
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            UnitAmount = request.Amount, // Amount in cents
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.ProductName ?? "Product",
                                Description = request.Description
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

            // Return the session ID to the client
            return Ok(new { sessionId = session.Id, url = session.Url });
        }
    }

    public class CheckoutSessionRequest
    {
        public long Amount { get; set; } // Amount in cents (e.g., 2999 = $29.99)
        public string ProductName { get; set; }
        public string Description { get; set; }
    }
}
*/