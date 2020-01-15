pragma solidity >=0.4.21 <0.7.0;

contract Deal {

  /// The seller's address
  address payable public owner;

  /// The buyer's address part on this contract
  address public buyerAddr;

  /// The Buyer struct
  struct Buyer {
    address addr;
    string name;

    bool init;
  }

  /// The Shipment struct
  struct Shipment {
    address payable courier;
    uint256 price;
    uint256 safepay;
    address payer;
    uint256 date;
    uint256 real_date;

    bool init;
  }

  /// The Order struct
  struct Order {
    string goods;
    uint256 quantity;
    uint256 number;
    uint256 price;
    uint256 safepay;
    Shipment shipment;

    bool init;
  }

  /// The Invoice struct
  struct Invoice {
    uint256 orderno;
    uint256 number;

    bool init;
  }

  /// The mapping to store orders
  mapping (uint256 => Order) orders;

  /// The mapping to store invoices
  mapping (uint256 => Invoice) invoices;

  /// The sequence number of orders
  uint256 orderseq;

  /// The sequence number of invoices
  uint256 invoiceseq;

  /// Event triggered for every registered buyer
  event BuyerRegistered(address buyer, string name);

  /// Event triggered for every new order
  event OrderSent(address buyer, string goods, uint256 quantity, uint256 orderno);

  /// Event triggerd when the order gets valued and wants to know the value of the payment
  event PriceSent(address buyer, uint256 orderno, uint256 price, int8 ttype);

  /// Event trigger when the buyer performs the safepay
  event SafepaySent(address buyer, uint256 orderno, uint256 value, uint256 now);

  /// Event triggered when the seller sends the invoice
  event InvoiceSent(address buyer, uint256 invoiceno, uint256 orderno, uint256 delivery_date, address courier);

  /// Event triggered when the courie delives the order
  event OrderDelivered(address buyer, uint256 invoiceno, uint256 orderno, uint256 real_delivey_date, address courier);

  /// The smart contract's constructor
  constructor(address _buyerAddr) public payable {
    /// The seller is the contract's owner
    owner = msg.sender;

    buyerAddr = _buyerAddr;
  }

  /// The function to send purchase orders
  ///   requires fee
  ///   Payable functions returns just the transaction object, with no custom field.
  ///   To get field values listen to OrderSent event.
  function sendOrder(string memory goods, uint256 quantity) public payable {
    /// Accept orders just from buyer
    require(msg.sender == buyerAddr);

    /// Increment the order sequence
    orderseq++;

    /// Create the order register
    orders[orderseq] = Order(goods, quantity, orderseq, 0, 0, Shipment(address(0), 0, 0, address(0), 0, 0, false), true);

    /// Trigger the event
    emit OrderSent(msg.sender, goods, quantity, orderseq);

  }

  /// The function to query orders by number
  ///   Constant functions returns custom fields
  function queryOrder(uint256 number) view public returns (address buyer, string memory goods, uint256 quantity, uint256 price, uint256 safepay, uint256 delivery_price, uint256 delivey_safepay) { 
    /// Validate the order number
    require(orders[number].init);

    /// Return the order data
    return(buyerAddr, orders[number].goods, orders[number].quantity, orders[number].price, orders[number].safepay, orders[number].shipment.price, orders[number].shipment.safepay);
  }

  /// The function to send the price to pay for order
  ///  Just the owner can call this function
  ///  requires free
  function sendPrice(uint256 orderno, uint256 price, int8 ttype) payable public {
  
    /// Only the owner can use this function
    require(msg.sender == owner);

    /// Validate the order number
    require(orders[orderno].init);

    /// Validate the type
    ///  1=order
    ///  2=shipment
    require(ttype == 1 || ttype == 2);

    if(ttype == 1){/// Price for Order

      /// Update the order price
      orders[orderno].price = price;

    } else {/// Price for Shipment

      /// Update the shipment price
      orders[orderno].shipment.price = price;
      orders[orderno].shipment.init = true;
    }

    /// Trigger the event
    emit PriceSent(buyerAddr, orderno, price, ttype);

  }

  /// The function to send the value of order's price
  ///  This value will be blocked until the delivery of order
  ///  requires fee
  function sendSafepay(uint256 orderno) public payable {

    /// Validate the order number
    require(orders[orderno].init,"Order not found");

    /// Just the buyer can make safepay
    require(buyerAddr == msg.sender,"Wrong buyer");

    /// The order's value plus the shipment value must equal to msg.value
    require((orders[orderno].price + orders[orderno].shipment.price) == msg.value,"price mismatch");

    orders[orderno].safepay = orders[orderno].price;
    orders[orderno].shipment.safepay = orders[orderno].shipment.price;
    // orders[orderno].shipment.safepay = orders[orderno].shipment.price;

    emit SafepaySent(msg.sender, orderno, msg.value, now);
  }

  /// The function to send the invoice data
  ///  requires fee
  function sendInvoice(uint256 orderno, uint256 delivery_date, address payable courier) payable public {

    /// Validate the order number
    require(orders[orderno].init,"order not found");

    /// Just the seller can send the invoice
    require(owner == msg.sender,"wrong sender");

    invoiceseq++;

    /// Create then Invoice instance and store it
    invoices[invoiceseq] = Invoice(orderno, invoiceseq, true);

    /// Update the shipment data
    orders[orderno].shipment.date = delivery_date;
    orders[orderno].shipment.courier = courier;

    /// Trigger the event
    emit InvoiceSent(buyerAddr, invoiceseq, orderno, delivery_date, courier);
  }

  /// The function to get the sent invoice
  ///  requires no fee
  function getInvoice(uint256 invoiceno) public view returns (address buyer, uint256 orderno, uint256 delivery_date, address courier){
    /// Validate the invoice number
    require(invoices[invoiceno].init,"Invoice not found");

    Invoice storage _invoice = invoices[invoiceno];
    Order storage _order = orders[_invoice.orderno];

    return (buyerAddr, _order.number, _order.shipment.date, _order.shipment.courier);
  }

  /// The function to mark an order as delivered
  function delivery(uint256 invoiceno, uint256 timestamp) public payable {

    /// Validate the invoice number
    require(invoices[invoiceno].init,
    "Invoice not found");

    Invoice storage invoice = invoices[invoiceno];
    Order storage _order = orders[invoice.orderno];

    /// Just the courier can call this function
    require(_order.shipment.courier == msg.sender,
    "Courier not found");

    emit OrderDelivered(buyerAddr, invoiceno, _order.number, timestamp, _order.shipment.courier);

    /// Payout the Order to the seller
    owner.transfer(_order.safepay);

    /// Payout the Shipment to the courier
    _order.shipment.courier.transfer(_order.shipment.safepay);

  }
}