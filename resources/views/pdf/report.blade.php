<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventory Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
        }
        th, td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: left;
            font-size: 12px;
        }
        th { 
            background-color: #f2f2f2; 
            font-weight: bold;
        }
        .text-center { 
            text-align: center; 
        }
        .text-right { 
            text-align: right; 
        }
        h2 { 
            text-align: center; 
            margin-bottom: 10px; 
        }
        .date { 
            text-align: right; 
            margin-bottom: 20px;
            font-size: 12px;
        }
        .signature-section {
            margin-top: 50px; 
            display: flex; 
            justify-content: space-between;
        }
        .signature-box {
            text-align: center; 
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #000; 
            margin-bottom: 10px;
            height: 40px;
        }
    </style>
</head>
<body>
    <h2>INVENTORY REPORT</h2>
    <div class="date">Date: {{ \Carbon\Carbon::parse($startDate)->format('F d, Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>ITEM NO.</th>
                <th>DESCRIPTION</th>
                <th>UNIT OF MEASURE</th>
                <th>BEGINNING INVENTORY</th>
                <th>ADD: RECEIPTS</th>
                <th>TOTAL</th>
                <th>LESS: ISSUANCE</th>
                <th>ENDING BALANCE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
                @php
                    $beginningInventory = $item->beginning_inventory ?? 0;
                    $receipts = $item->added_receipt ?? ($item->quantities->sum('quantity') ?? 0);
                    $issuances = $item->less ?? ($item->issuances->sum('fulfilled_quantity') ?? 0);
                    $total = $item->total ?? ($beginningInventory + $receipts);
                    $endingBalance = $item->ending_balance ?? ($total - $issuances);
                @endphp
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->description }}</td>
                    <td>{{ $item->unit_of_measure }}</td>
                    <td class="text-right">{{ $beginningInventory }}</td>
                    <td class="text-right">{{ $receipts ?: '0' }}</td>
                    <td class="text-right">{{ $total }}</td>
                    <td class="text-right">{{ $issuances }}</td>
                    <td class="text-right">{{ max($endingBalance, 0) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <p>Prepared By</p>
        </div>

        <div class="signature-box">
            <div class="signature-line"></div>
            <p>Approved By</p>
        </div>
    </div>
</body>
</html>
