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
    <div class="date">Date: {{ now()->format('F d, Y') }}</div>

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
                @if($item->history->count() > 0)
                    @php
                        $grouped = collect($item->history)->reduce(function($acc, $h) {
                            if(!isset($acc[$h->item_id])){
                                $acc[$h->item_id] = [
                                    'item_id' => $h->item_id,
                                    'unit_of_measure' => $h->unit_of_measure,
                                    'total' => 0,
                                    'less' => 0,
                                    'add_receipts' => []
                                ];
                            }
                            $acc[$h->item_id]['total'] += $h->total ?? 0;
                            $acc[$h->item_id]['less'] += $h->less ?? 0;
                            $receipts = is_array($h->add_receipts) ? $h->add_receipts : [];
                            $acc[$h->item_id]['add_receipts'] = array_merge($acc[$h->item_id]['add_receipts'], $receipts);
                            return $acc;
                        }, []);
                        
                        $firstHistory = $item->history->first();
                        $beginningInventory = $firstHistory?->beginning_inventory ?? 0;
                    @endphp
                    @foreach($grouped as $history)
                    <tr>
                        <td>{{ $history['item_id'] }}</td>
                        <td>{{ $item->description }}</td>
                        <td>{{ $history['unit_of_measure'] }}</td>
                        <td class="text-right">{{ $beginningInventory }}</td>
                        <td class="text-right">{{ implode(' + ', $history['add_receipts']) ?: '0' }}</td>
                        <td class="text-right">{{ $history['total'] }}</td>
                        <td class="text-right">{{ $history['less'] }}</td>
                        <td class="text-right">{{ $history['total'] - $history['less'] }}</td>
                    </tr>
                    @endforeach
                @endif
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
