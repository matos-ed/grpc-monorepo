// Original file: proto/orders/v1/orders.proto


export interface OrderInput {
  'id'?: (string);
  'userId'?: (string);
  'userName'?: (string);
  'item'?: (string);
  'quantity'?: (number);
  'createdAt'?: (string);
}

export interface Order {
  'id': (string);
  'userId': (string);
  'userName': (string);
  'item': (string);
  'quantity': (number);
  'createdAt': (string);
}
