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
    @foreach($items as $item)
    <tr>
        <td>{{ $item->id }}</td>
        <td>{{ $item->description }}</td>
        <td>{{ $item->unit_of_measure }}</td>
        <td>{{ $beginnings[$item->id] ?? 0 }}</td>  {{-- Beginning (last month's ending) --}}
        <td>{{ is_array($item->quantities) ? implode(' + ', array_column($item->quantities, 'quantity')) : $item->quantity }}</td>
        <td>{{ $item->total ?? '—' }}</td>
        <td>
    {{
        collect($issuances)
            ->where('item_id', $item->id)
            ->sum(function ($i) {
                return is_array($i->fulfilled_quantity)
                    ? array_sum($i->fulfilled_quantity)
                    : ($i->fulfilled_quantity ?? 0);
            })
    }}
</td>
        <td>{{ ($item->total ?? 0) - ($item->less ?? 0)}}</td>
    </tr>
    @endforeach
</table>

</body>
</html>