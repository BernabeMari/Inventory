<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>

<h2>RECEIVER ISSUANCE</h2>
<p>Date: {{ now()->format('F d, Y') }}</p>

<table width="100%" border="1" cellpadding="6">
    <tr>
        <th>ID</th>
        <th>Description</th>
        <th>Unit of Measure</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Less</th>
    </tr>
    <tr>
        <td>{{ $receiver->id }}</td>
        <td>{{ $receiver->description }}</td>
        <td>{{ $receiver->unit_of_measure }}</td>
        <td>{{ is_array($receiver->quantity) ? implode(', ', $receiver->quantity) : $receiver->quantity }}</td>
        <td>{{ $receiver->total }}</td>
        <td>{{ $receiver->less ?? '—' }}</td>
    </tr>
</table>

</body>
</html>