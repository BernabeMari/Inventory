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
        <th>DESCRIPTION</th>
        <th>UNIT OF MEASURE</th>
        <th>BEGINNING OF INVENTORY</th>
        <th>ADD: RECEIPTS</th>
        <th>TOTAL</th>
        <th>LESS: ISSUANCE</th>
        <th>ENDING BALANCE</th>
    </tr>
    @foreach($receivers as $receiver)
    <tr>
        <td>{{ $receiver->id }}</td>
        <td>{{ $receiver->description }}</td>
        <td>{{ $receiver->unit_of_measure }}</td>
        <td>{{ $beginnings[$receiver->id] ?? 0 }}</td>  {{-- Beginning (last month's ending) --}}
        <td>{{ is_array($receiver->quantity) ? implode(' + ', $receiver->quantity) : $receiver->quantity }}</td>
        <td>{{ $receiver->total ?? '—' }}</td>
        <td>{{ $receiver->less ?? '—' }}</td>
        <td>{{ ($receiver->total ?? 0) - ($receiver->less ?? 0)}}</td>
    </tr>
    @endforeach
</table>

</body>
</html>