#Vehicle Delivery Distance API Doc

##Request

**/api/vehicle-delivery-distance**

HTTP POST
Accept = "application/json"

The endpoint expects a query string with the following keys. Bolded keys are required. Additional keys not listed below will be ignored.

| Query string keys              |
| ------------------------------ |
| DealerAddress.AddressLineOne   |
| DealerAddress.AddressLineTwo   |
| DealerAddress.Town             |
| DealerAddress.County           |
| **DealerAddress.Postcode**     |
| CustomerAddress.AddressLineOne |
| CustomerAddress.AddressLineTwo |
| CustomerAddress.Town           |
| CustomerAddress.County         |
| **CustomerAddress.Postcode**   |

##Example
/api/vehicle-delivery-distance?

---

##Response

**Case**: Valid locations with an existing route between them
200 OK

```
{
    "Miles": "miles value here as parsable double in string"
}
```

**Case**: Location(s) couldn't be found or don't exist, or locations are valid but without a route between them
200 OK

```
{
    "Miles": null
}
```

**Case**: Missing dealer or customer postcode
400 Bad Request

```
{
    "Errors": {
        "CustomerAddress.Postcode": [
            "A postcode is required"
        ],
        "DealerAddress.Postcode": [
            "A postcode is required"
        ]
    }
}
```

**Other unknown errors, including invalid API key**:
500 Internal Server Error

```
{
    "Error": "Starkwood failed to connect with the Google Distance Matrix API"
}
```
