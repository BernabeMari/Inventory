<h2>REQUEST ISSUANCE</h2>

<p>Date: {{ now()->format('F d, Y') }}</p>

<table width="100%" border="1">
    <tr>
        <th>Request ID</th>
        <th>Request Item</th>
        <th>Request Quantity</th>
        <th>Issued Item</th>
        <th>Fulfilled Quantity</th>
        <th>Unfulfilled Quantity</th>
        <th>Status</th>
    </tr>

    <tr>
        <td>{{ $request->id }}</td>
        <td>{{ $request->item }}</td>
        <td>{{ $request->quantity }}</td>
        <td>{{ $request->issued_item }}</td>
        <td>{{ $request->fulfilled_quantity }}</td>
        <td>{{ $request->unfulfilled_quantity }}</td>
        <td>{{ $request->status }}</td>
    </tr>
</table>
<br><br>

<div style="margin-top: 80px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 200px;">
        <div style="border-top: 1px solid #000;"></div>
        <p>Requester Signature</p>
    </div>

    <div style="text-align: center; width: 200px; margin-top: 80px;">
        <div style="border-top: 1px solid #000;"></div>
        <p>Approved By</p>
    </div>
</div>