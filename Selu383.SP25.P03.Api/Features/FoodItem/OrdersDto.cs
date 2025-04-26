using System;

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SeatId { get; set; }
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
        public string PaymentMethod { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
    }
}